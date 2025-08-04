import OpenAI from 'openai';
import { ScriptGenerationRequest, ScriptGenerationResponse } from '../types';

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate a script for short-form video content
   */
  async generateScript(request: ScriptGenerationRequest): Promise<ScriptGenerationResponse> {
    const { prompt, youtubeUrl, maxWords = 150, tone = 'casual' } = request;

    // Build the system message based on tone
    const toneInstructions = {
      casual: 'Use a conversational, friendly tone. Include relatable examples.',
      professional: 'Use a formal, authoritative tone. Focus on facts and expertise.',
      funny: 'Use humor, wit, and entertaining language. Include jokes or puns where appropriate.',
      educational: 'Use clear, instructive language. Break down complex topics simply.',
      motivational: 'Use inspiring, uplifting language. Include calls to action.'
    };

    const systemMessage = `You are an expert short-form video scriptwriter. Create engaging scripts for TikTok, YouTube Shorts, and Instagram Reels. 
    ${toneInstructions[tone]}
    Keep scripts under ${maxWords} words, suitable for 30-60 second videos.
    Structure the script with a strong hook in the first 3 seconds.
    Make it punchy, engaging, and shareable.`;

    const userMessage = prompt 
      ? `Create a short-form video script about: ${prompt}`
      : `Create a short-form video script based on this YouTube video: ${youtubeUrl}`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      const script = completion.choices[0]?.message?.content || '';
      
      // Extract or generate a title
      const titleMatch = script.match(/^#\s*(.+)$/m);
      const title = titleMatch ? titleMatch[1] : this.generateTitle(script);

      // Calculate metrics
      const wordCount = script.split(/\s+/).length;
      const estimatedDuration = Math.ceil(wordCount / 2.5); // ~150 words per minute

      return {
        script: script.trim(),
        title,
        duration: estimatedDuration,
        wordCount
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate script');
    }
  }

  /**
   * Generate a title from the script content
   */
  private generateTitle(script: string): string {
    // Take first line or first 50 characters as title
    const firstLine = script.split('\n')[0];
    if (firstLine.length <= 50) {
      return firstLine.replace(/[#*]/g, '').trim();
    }
    return firstLine.substring(0, 47).trim() + '...';
  }

  /**
   * Extract transcript from YouTube URL (placeholder - would need YouTube API)
   */
  async extractYouTubeTranscript(url: string): Promise<string> {
    // This is a placeholder. In production, you would:
    // 1. Extract video ID from URL
    // 2. Use YouTube Data API to get captions
    // 3. Or use a service like youtube-transcript-api
    
    console.log('YouTube transcript extraction not implemented yet');
    return 'YouTube transcript extraction coming soon...';
  }
}

export default new OpenAIService();