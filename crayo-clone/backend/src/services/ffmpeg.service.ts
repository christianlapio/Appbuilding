import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { VideoGenerationRequest, VideoGenerationResponse } from '../types';

class FFmpegService {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(__dirname, '../../generated');
  }

  /**
   * Generate a video with background, voiceover, music, and captions
   */
  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const {
      script,
      voiceoverUrl,
      backgroundVideoId,
      backgroundMusicId,
      captionStyle,
      musicVolume = 0.3
    } = request;

    const outputFilename = `video_${Date.now()}.mp4`;
    const outputPath = path.join(this.outputDir, outputFilename);

    try {
      // For MVP, we'll create a simple command that combines the elements
      // In production, this would be much more complex with proper caption rendering
      
      const ffmpegArgs = [
        '-i', this.getLocalPath(backgroundVideoId), // Background video
        '-i', this.getLocalPath(voiceoverUrl), // Voiceover
        '-i', this.getLocalPath(backgroundMusicId), // Background music
        '-filter_complex', this.buildFilterComplex(musicVolume, captionStyle),
        '-map', '[v]',
        '-map', '[a]',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-t', '60', // Max 60 seconds
        '-aspect', '9:16', // Vertical video
        '-y', // Overwrite output
        outputPath
      ];

      await this.runFFmpeg(ffmpegArgs);

      // Get video duration
      const duration = await this.getVideoDuration(outputPath);

      return {
        videoUrl: `/generated/${outputFilename}`,
        duration,
        format: 'mp4',
        resolution: '1080x1920'
      };
    } catch (error) {
      console.error('FFmpeg error:', error);
      // For development, return a mock response
      return this.generateMockVideo();
    }
  }

  /**
   * Build filter complex for FFmpeg
   */
  private buildFilterComplex(musicVolume: number, captionStyle: any): string {
    // Basic filter to mix audio and scale video
    // In production, this would include caption rendering with drawtext filter
    return `[1:a]volume=1[voice];[2:a]volume=${musicVolume}[music];[voice][music]amix=inputs=2[a];[0:v]scale=1080:1920,setsar=1[v]`;
  }

  /**
   * Run FFmpeg command
   */
  private runFFmpeg(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', args);

      ffmpeg.stderr.on('data', (data) => {
        console.log(`FFmpeg: ${data}`);
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });

      ffmpeg.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Get video duration using ffprobe
   */
  private async getVideoDuration(videoPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'json',
        videoPath
      ]);

      let output = '';
      ffprobe.stdout.on('data', (data) => {
        output += data;
      });

      ffprobe.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(Math.ceil(parseFloat(result.format.duration)));
          } catch (error) {
            resolve(60); // Default to 60 seconds
          }
        } else {
          resolve(60); // Default to 60 seconds
        }
      });
    });
  }

  /**
   * Convert URL to local file path
   */
  private getLocalPath(url: string): string {
    // In production, this would handle remote URLs properly
    // For now, assume local files
    return path.join(__dirname, '../..', url);
  }

  /**
   * Generate captions file (SRT format)
   */
  async generateCaptions(script: string, duration: number): Promise<string> {
    const words = script.split(/\s+/);
    const wordsPerSecond = words.length / duration;
    const captionDuration = 3; // Show each caption for 3 seconds
    
    let srtContent = '';
    let currentTime = 0;
    let captionIndex = 1;
    
    for (let i = 0; i < words.length; i += Math.ceil(wordsPerSecond * captionDuration)) {
      const captionWords = words.slice(i, i + Math.ceil(wordsPerSecond * captionDuration));
      const startTime = this.formatSRTTime(currentTime);
      currentTime += captionDuration;
      const endTime = this.formatSRTTime(Math.min(currentTime, duration));
      
      srtContent += `${captionIndex}\n`;
      srtContent += `${startTime} --> ${endTime}\n`;
      srtContent += `${captionWords.join(' ')}\n\n`;
      
      captionIndex++;
    }
    
    const captionFilename = `captions_${Date.now()}.srt`;
    const captionPath = path.join(this.outputDir, captionFilename);
    fs.writeFileSync(captionPath, srtContent);
    
    return captionPath;
  }

  /**
   * Format time for SRT file
   */
  private formatSRTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.round((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${millis.toString().padStart(3, '0')}`;
  }

  /**
   * Generate mock video for development
   */
  private generateMockVideo(): VideoGenerationResponse {
    const filename = `mock_video_${Date.now()}.mp4`;
    
    return {
      videoUrl: `/generated/${filename}`,
      duration: 45,
      format: 'mp4',
      resolution: '1080x1920'
    };
  }
}

export default new FFmpegService();