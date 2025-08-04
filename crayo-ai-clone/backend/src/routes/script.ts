import { Router, Request, Response } from 'express';
import { ScriptGenerationRequest, ApiResponse } from '../types';
import openaiService from '../services/openaiService';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /api/script/generate
 * Generate a script from a prompt using GPT-4
 */
router.post('/generate', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { prompt, duration, tone }: ScriptGenerationRequest = req.body;

    // Validation
    if (!prompt || prompt.trim().length === 0) {
      throw new AppError('Prompt is required', 400);
    }

    if (prompt.length > 500) {
      throw new AppError('Prompt must be less than 500 characters', 400);
    }

    if (duration && (duration < 15 || duration > 180)) {
      throw new AppError('Duration must be between 15 and 180 seconds', 400);
    }

    // Generate script
    const script = await openaiService.generateScript({
      prompt: prompt.trim(),
      duration,
      tone
    });

    res.json({
      success: true,
      data: {
        script,
        prompt,
        duration: duration || 60,
        tone: tone || 'energetic'
      },
      message: 'Script generated successfully'
    });

  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
    } else {
      console.error('Script generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate script'
      });
    }
  }
});

/**
 * POST /api/script/captions
 * Generate captions with timing from script and audio duration
 */
router.post('/captions', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { script, audioDuration } = req.body;

    // Validation
    if (!script || script.trim().length === 0) {
      throw new AppError('Script is required', 400);
    }

    if (!audioDuration || audioDuration <= 0) {
      throw new AppError('Audio duration is required and must be positive', 400);
    }

    // Generate captions
    const captions = await openaiService.generateCaptions(script, audioDuration);

    res.json({
      success: true,
      data: {
        captions,
        script,
        audioDuration
      },
      message: 'Captions generated successfully'
    });

  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
    } else {
      console.error('Caption generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate captions'
      });
    }
  }
});

export default router;