import { Request, Response } from 'express';
import elevenlabsService from '../services/elevenlabs.service';
import { VoiceoverRequest } from '../types';

export class VoiceoverController {
  /**
   * Get available voices
   */
  async getVoices(req: Request, res: Response) {
    try {
      const voices = await elevenlabsService.getVoices();
      
      res.json({
        success: true,
        data: voices
      });
    } catch (error) {
      console.error('Failed to get voices:', error);
      res.status(500).json({
        error: 'Failed to fetch voices',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Generate voiceover from text
   */
  async generateVoiceover(req: Request<{}, {}, VoiceoverRequest>, res: Response) {
    try {
      const { text, voiceId, speed, pitch } = req.body;

      // Validate input
      if (!text || !voiceId) {
        return res.status(400).json({
          error: 'Text and voiceId are required'
        });
      }

      // Generate voiceover
      const voiceoverData = await elevenlabsService.generateVoiceover({
        text,
        voiceId,
        speed,
        pitch
      });

      res.json({
        success: true,
        data: voiceoverData
      });
    } catch (error) {
      console.error('Voiceover generation error:', error);
      res.status(500).json({
        error: 'Failed to generate voiceover',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Preview a voice with sample text
   */
  async previewVoice(req: Request, res: Response) {
    try {
      const { voiceId } = req.params;
      const sampleText = 'Hello! This is a preview of how this voice sounds. Pretty cool, right?';

      const voiceoverData = await elevenlabsService.generateVoiceover({
        text: sampleText,
        voiceId
      });

      res.json({
        success: true,
        data: voiceoverData
      });
    } catch (error) {
      console.error('Voice preview error:', error);
      res.status(500).json({
        error: 'Failed to generate voice preview',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new VoiceoverController();