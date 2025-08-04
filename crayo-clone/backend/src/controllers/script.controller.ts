import { Request, Response } from 'express';
import openaiService from '../services/openai.service';
import { ScriptGenerationRequest } from '../types';

export class ScriptController {
  /**
   * Generate a script based on user prompt or YouTube URL
   */
  async generateScript(req: Request<{}, {}, ScriptGenerationRequest>, res: Response) {
    try {
      const { prompt, youtubeUrl, maxWords, tone } = req.body;

      // Validate input
      if (!prompt && !youtubeUrl) {
        return res.status(400).json({
          error: 'Either prompt or youtubeUrl is required'
        });
      }

      // Generate script
      const scriptData = await openaiService.generateScript({
        prompt,
        youtubeUrl,
        maxWords,
        tone
      });

      res.json({
        success: true,
        data: scriptData
      });
    } catch (error) {
      console.error('Script generation error:', error);
      res.status(500).json({
        error: 'Failed to generate script',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Extract transcript from YouTube URL
   */
  async extractTranscript(req: Request, res: Response) {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({
          error: 'YouTube URL is required'
        });
      }

      const transcript = await openaiService.extractYouTubeTranscript(url);

      res.json({
        success: true,
        data: {
          transcript,
          url
        }
      });
    } catch (error) {
      console.error('Transcript extraction error:', error);
      res.status(500).json({
        error: 'Failed to extract transcript',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new ScriptController();