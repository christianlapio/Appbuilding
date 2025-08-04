import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { 
      audioBase64, 
      backgroundVideo, 
      captions, 
      backgroundMusic,
      outputFileName = 'output.mp4'
    } = await request.json();

    if (!audioBase64) {
      return NextResponse.json(
        { error: 'Audio is required' },
        { status: 400 }
      );
    }

    // Create temporary directory for processing
    const tempDir = join(process.cwd(), 'temp');
    const audioPath = join(tempDir, 'audio.mp3');
    const outputPath = join(tempDir, outputFileName);

    // Decode base64 audio
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    await writeFile(audioPath, audioBuffer);

    // Build FFmpeg command
    let ffmpegCommand = `ffmpeg -y`;

    // Add background video (if provided)
    if (backgroundVideo) {
      ffmpegCommand += ` -i "${backgroundVideo}"`;
    } else {
      // Create a solid color background if no video provided
      ffmpegCommand += ` -f lavfi -i color=c=black:size=1080x1920:d=60`;
    }

    // Add audio
    ffmpegCommand += ` -i "${audioPath}"`;

    // Add background music (if provided)
    if (backgroundMusic) {
      ffmpegCommand += ` -i "${backgroundMusic}"`;
    }

    // Complex filter for mixing audio and adding captions
    let filterComplex = '';
    
    if (backgroundMusic) {
      // Mix voiceover and background music
      filterComplex += `[1:a][2:a]amix=inputs=2:duration=longest[audio];`;
    } else {
      filterComplex += `[1:a]aformat=sample_rates=44100:channel_layouts=stereo[audio];`;
    }

    // Add captions if provided
    if (captions && captions.length > 0) {
      filterComplex += `[0:v]`;
      captions.forEach((caption: any, index: number) => {
        filterComplex += `drawtext=text='${caption.text}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=${caption.y}:enable='between(t,${caption.startTime},${caption.endTime})'`;
        if (index < captions.length - 1) filterComplex += ',';
      });
      filterComplex += `[v]`;
    } else {
      filterComplex += `[0:v]copy[v]`;
    }

    // Complete FFmpeg command
    ffmpegCommand += ` -filter_complex "${filterComplex}" -map "[v]" -map "[audio]" -c:v libx264 -c:a aac -shortest "${outputPath}"`;

    // Execute FFmpeg command
    await execAsync(ffmpegCommand);

    // Read the output file
    const outputBuffer = await readFile(outputPath);

    // Clean up temporary files
    try {
      await unlink(audioPath);
      await unlink(outputPath);
    } catch (error) {
      console.warn('Failed to clean up temporary files:', error);
    }

    // Return the video as base64
    const base64Video = outputBuffer.toString('base64');

    return NextResponse.json({ 
      video: base64Video,
      fileName: outputFileName
    });
  } catch (error) {
    console.error('Error rendering video:', error);
    return NextResponse.json(
      { error: 'Failed to render video' },
      { status: 500 }
    );
  }
}

// Helper function to read file
async function readFile(path: string): Promise<Buffer> {
  const { readFile } = await import('fs/promises');
  return readFile(path);
}