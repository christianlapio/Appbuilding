import OpenAI from 'openai';
import { ScriptGenerationRequest } from '../types';
import { AppError } from '../middleware/errorHandler';

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️  OpenAI API key not found. Using mock responses for demo.');
      this.openai = null as any; // Will use mock responses
    } else {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  /**
   * Generate a script for short-form video content
   */
  async generateScript(request: ScriptGenerationRequest): Promise<string> {
    try {
      const { prompt, duration = 60, tone = 'energetic' } = request;

      // If no API key, return a mock response
      if (!this.openai) {
        console.log('🎬 Generating mock script for demo...');
        const mockScript = `Hey there! Are you struggling with ${prompt.toLowerCase()}? You're not alone! 

Here's the thing - most people think it's complicated, but I'm about to share a game-changing approach that will transform how you think about this.

First, understand that the key is consistency. Second, focus on small, actionable steps rather than trying to do everything at once. And finally, remember that progress beats perfection every single time.

Try this for just 7 days and watch what happens. Trust me, you'll be amazed by the results!

What's your biggest challenge with this? Drop it in the comments below and I'll personally help you out. Don't forget to follow for more life-changing tips!`;
        
        return mockScript;
      }

      const systemPrompt = `You are an expert content creator for short-form videos (TikTok, YouTube Shorts, Instagram Reels). 
      Create engaging, viral-worthy scripts that:
      - Hook viewers in the first 3 seconds
      - Are optimized for ${duration} seconds or less
      - Use a ${tone} tone
      - Include natural pauses for captions
      - Are structured for visual storytelling
      - End with a strong call-to-action or memorable conclusion
      
      Format the script with clear sentences and natural speaking rhythm.
      Do not include stage directions or camera instructions.
      Focus on the spoken content only.`;

      const userPrompt = `Create a ${duration}-second script about: ${prompt}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.8,
      });

      const script = completion.choices[0]?.message?.content;
      
      if (!script) {
        throw new AppError('Failed to generate script', 500);
      }

      return script.trim();
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      
      console.error('OpenAI API Error:', error);
      throw new AppError('Failed to generate script with OpenAI', 500);
    }
  }

  /**
   * Generate captions with timing from script
   */
  async generateCaptions(script: string, audioDuration: number): Promise<Array<{text: string, startTime: number, endTime: number}>> {
    try {
      const systemPrompt = `You are a caption timing expert. Break down the given script into caption segments with precise timing.
      
      Rules:
      - Each caption should be 3-7 words maximum
      - Captions should align with natural speech patterns
      - Total duration is ${audioDuration} seconds
      - Return as JSON array with format: [{"text": "Caption text", "startTime": 0.0, "endTime": 2.5}]
      - Ensure no gaps between captions
      - Make sure the last caption ends at exactly ${audioDuration} seconds`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Script: "${script}"` }
        ],
        max_tokens: 800,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new AppError('Failed to generate captions', 500);
      }

      // Parse JSON response
      const captions = JSON.parse(response);
      return captions;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      
      console.error('Caption generation error:', error);
      throw new AppError('Failed to generate captions', 500);
    }
  }
}

export default new OpenAIService();