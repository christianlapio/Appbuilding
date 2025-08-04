import { Router, Request, Response } from 'express';
import { VoiceoverRequest, ApiResponse } from '../types';
import elevenlabsService from '../services/elevenlabsService';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

/**
 * GET /api/voice/list
 * Get available voices from ElevenLabs
 */
router.get('/list', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const voices = await elevenlabsService.getVoices();

    res.json({
      success: true,
      data: { voices },
      message: 'Voices retrieved successfully'
    });

  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
    } else {
      console.error('Voice list error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve voices'
      });
    }
  }
});

/**
 * POST /api/voice/generate
 * Generate voiceover from script using ElevenLabs
 */
router.post('/generate', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { script, voiceId, speed, stability }: VoiceoverRequest = req.body;

    // Validation
    if (!script || script.trim().length === 0) {
      throw new AppError('Script is required', 400);
    }

    if (!voiceId) {
      throw new AppError('Voice ID is required', 400);
    }

    if (script.length > 5000) {
      throw new AppError('Script must be less than 5000 characters', 400);
    }

    if (speed && (speed < 0.5 || speed > 2.0)) {
      throw new AppError('Speed must be between 0.5 and 2.0', 400);
    }

    if (stability && (stability < 0 || stability > 1)) {
      throw new AppError('Stability must be between 0 and 1', 400);
    }

    // Generate voiceover
    const audioBuffer = await elevenlabsService.generateVoiceover({
      script: script.trim(),
      voiceId,
      speed,
      stability
    });

    // Save audio file
    const filename = `voiceover_${uuidv4()}`;
    const filePath = await elevenlabsService.saveAudioFile(audioBuffer, filename);

    // Estimate duration
    const estimatedDuration = elevenlabsService.estimateAudioDuration(script, speed || 1.0);

    res.json({
      success: true,
      data: {
        audioUrl: `/uploads/audio/${filename}.mp3`,
        filePath,
        duration: estimatedDuration,
        voiceId,
        script: script.trim()
      },
      message: 'Voiceover generated successfully'
    });

  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
    } else {
      console.error('Voiceover generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate voiceover'
      });
    }
  }
});

export default router;