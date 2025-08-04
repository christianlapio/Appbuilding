import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, youtubeUrl } = await request.json();

    if (!prompt && !youtubeUrl) {
      return NextResponse.json(
        { error: 'Either prompt or YouTube URL is required' },
        { status: 400 }
      );
    }

    let scriptPrompt = '';
    
    if (youtubeUrl) {
      // For now, we'll just use the URL as context
      // In a full implementation, you'd extract the transcript
      scriptPrompt = `Create a short-form video script (30-60 seconds) based on this YouTube video: ${youtubeUrl}. Make it engaging, educational, and suitable for platforms like TikTok, Instagram Reels, or YouTube Shorts. Include natural speech patterns and conversational tone.`;
    } else {
      scriptPrompt = `Create a short-form video script (30-60 seconds) about: "${prompt}". Make it engaging, educational, and suitable for platforms like TikTok, Instagram Reels, or YouTube Shorts. Include natural speech patterns and conversational tone. Keep it under 150 words.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional script writer for short-form videos. Create engaging, educational content that's perfect for social media platforms."
        },
        {
          role: "user",
          content: scriptPrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const script = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
}