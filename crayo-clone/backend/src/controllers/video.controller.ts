import { Request, Response } from 'express';
import ffmpegService from '../services/ffmpeg.service';
import mediaService from '../services/media.service';
import { VideoGenerationRequest } from '../types';

export class VideoController {
  /**
   * Get available background videos
   */
  async getBackgroundVideos(req: Request, res: Response) {
    try {
      const videos = await mediaService.getBackgroundVideos();
      
      res.json({
        success: true,
        data: videos
      });
    } catch (error) {
      console.error('Failed to get background videos:', error);
      res.status(500).json({
        error: 'Failed to fetch background videos',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get available background music
   */
  async getBackgroundMusic(req: Request, res: Response) {
    try {
      const music = await mediaService.getBackgroundMusic();
      
      res.json({
        success: true,
        data: music
      });
    } catch (error) {
      console.error('Failed to get background music:', error);
      res.status(500).json({
        error: 'Failed to fetch background music',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Auto-select background video based on script
   */
  async autoSelectBackground(req: Request, res: Response) {
    try {
      const { script } = req.body;

      if (!script) {
        return res.status(400).json({
          error: 'Script is required for auto-selection'
        });
      }

      const selectedVideo = await mediaService.autoSelectBackgroundVideo(script);
      
      res.json({
        success: true,
        data: selectedVideo
      });
    } catch (error) {
      console.error('Failed to auto-select background:', error);
      res.status(500).json({
        error: 'Failed to auto-select background',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Generate final video
   */
  async generateVideo(req: Request<{}, {}, VideoGenerationRequest>, res: Response) {
    try {
      const {
        script,
        voiceoverUrl,
        backgroundVideoId,
        backgroundMusicId,
        captionStyle,
        musicVolume
      } = req.body;

      // Validate required fields
      if (!script || !voiceoverUrl || !backgroundVideoId || !backgroundMusicId) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['script', 'voiceoverUrl', 'backgroundVideoId', 'backgroundMusicId']
        });
      }

      // Validate background video and music exist
      const backgroundVideo = await mediaService.getBackgroundVideoById(backgroundVideoId);
      const backgroundMusic = await mediaService.getBackgroundMusicById(backgroundMusicId);

      if (!backgroundVideo || !backgroundMusic) {
        return res.status(400).json({
          error: 'Invalid background video or music ID'
        });
      }

      // Generate video
      const videoData = await ffmpegService.generateVideo({
        script,
        voiceoverUrl,
        backgroundVideoId: backgroundVideo.url,
        backgroundMusicId: backgroundMusic.url,
        captionStyle: captionStyle || {
          fontFamily: 'Arial',
          fontSize: 48,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          animation: 'fade',
          position: 'center'
        },
        musicVolume
      });

      res.json({
        success: true,
        data: videoData
      });
    } catch (error) {
      console.error('Video generation error:', error);
      res.status(500).json({
        error: 'Failed to generate video',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Generate captions file
   */
  async generateCaptions(req: Request, res: Response) {
    try {
      const { script, duration } = req.body;

      if (!script || !duration) {
        return res.status(400).json({
          error: 'Script and duration are required'
        });
      }

      const captionPath = await ffmpegService.generateCaptions(script, duration);
      
      res.json({
        success: true,
        data: {
          captionUrl: captionPath.replace(process.cwd(), '')
        }
      });
    } catch (error) {
      console.error('Caption generation error:', error);
      res.status(500).json({
        error: 'Failed to generate captions',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new VideoController();