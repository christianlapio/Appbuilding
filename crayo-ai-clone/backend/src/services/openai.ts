import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ScriptGenerationRequest {
  prompt: string;
  duration?: number; // Target duration in seconds (default: 60)
  tone?: 'casual' | 'professional' | 'energetic' | 'educational';
}

export interface GeneratedScript {
  title: string;
  script: string;
  estimatedDuration: number;
  keyPoints: string[];
}

/**
 * Generate a script for short-form video content using GPT-4
 */
export async function generateScript(request: ScriptGenerationRequest): Promise<GeneratedScript> {
  const { prompt, duration = 60, tone = 'engaging' } = request;

  try {
    const systemPrompt = `You are an expert content creator specializing in short-form video scripts for TikTok, YouTube Shorts, and Instagram Reels. 

Your task is to create engaging, viral-worthy scripts that:
- Are optimized for ${duration} seconds or less
- Hook viewers in the first 3 seconds
- Maintain high engagement throughout
- Include natural pauses for emphasis
- Are written in a ${tone} tone
- Include clear, actionable content

Format your response as JSON with these fields:
- title: A catchy title for the video
- script: The full script with natural speaking rhythm
- estimatedDuration: Estimated speaking time in seconds
- keyPoints: Array of 3-5 main takeaways

Keep the script conversational and include strategic pauses marked with [PAUSE].`;

    const userPrompt = `Create a short-form video script about: "${prompt}"

Target duration: ${duration} seconds
Tone: ${tone}

Make it engaging, informative, and perfect for social media consumption.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse JSON response
    try {
      const parsedScript = JSON.parse(response);
      return parsedScript as GeneratedScript;
    } catch (parseError) {
      // Fallback: create structured response from plain text
      return {
        title: `${prompt} - Short Video`,
        script: response,
        estimatedDuration: Math.ceil(response.split(' ').length / 2.5), // Rough estimate: 2.5 words per second
        keyPoints: response.split('.').slice(0, 3).map(point => point.trim()).filter(Boolean)
      };
    }

  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script. Please check your OpenAI API key and try again.');
  }
}

/**
 * Extract transcript from YouTube URL (placeholder for future implementation)
 */
export async function extractYouTubeTranscript(url: string): Promise<string> {
  // TODO: Implement YouTube transcript extraction
  // For now, return a placeholder
  throw new Error('YouTube transcript extraction not yet implemented. Please use the prompt-based script generation instead.');
}