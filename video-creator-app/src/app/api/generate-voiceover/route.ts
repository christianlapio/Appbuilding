import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabs } from '@elevenlabs/elevenlabs-js';

const elevenlabs = new (ElevenLabs as any)({
  apiKey: process.env.ELEVENLABS_API_KEY || '',
});

// Available voices - you can customize these
const AVAILABLE_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Female, warm and friendly' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Female, energetic and enthusiastic' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Female, calm and professional' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Male, deep and authoritative' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Male, young and energetic' },
];

export async function POST(request: NextRequest) {
  try {
    const { script, voiceId } = await request.json();

    if (!script) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    // Use provided voiceId or default to first voice
    const selectedVoiceId = voiceId || AVAILABLE_VOICES[0].id;

    // Generate audio using ElevenLabs
    const audio = await elevenlabs.textToSpeech({
      text: script,
      voiceId: selectedVoiceId,
      modelId: 'eleven_monolingual_v1',
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.5,
      },
    });

    // Convert audio to base64 for easy transfer
    const audioBuffer = await audio.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({ 
      audio: base64Audio,
      voiceId: selectedVoiceId,
      availableVoices: AVAILABLE_VOICES
    });
  } catch (error) {
    console.error('Error generating voiceover:', error);
    return NextResponse.json(
      { error: 'Failed to generate voiceover' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available voices
  return NextResponse.json({ 
    availableVoices: AVAILABLE_VOICES 
  });
}