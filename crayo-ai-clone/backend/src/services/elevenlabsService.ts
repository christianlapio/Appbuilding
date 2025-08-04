import axios from 'axios';
import { VoiceoverRequest, Voice } from '../types';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';

class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    if (!process.env.ELEVENLABS_API_KEY) {
      console.warn('⚠️  ElevenLabs API key not found. Using mock responses for demo.');
      this.apiKey = 'mock-key';
    } else {
      this.apiKey = process.env.ELEVENLABS_API_KEY;
    }
  }

  /**
   * Get available voices from ElevenLabs
   */
  async getVoices(): Promise<Voice[]> {
    try {
      // If using mock key, return mock voices
      if (this.apiKey === 'mock-key') {
        console.log('🎤 Returning mock voices for demo...');
        return [
          {
            id: 'voice-1',
            name: 'Sarah',
            gender: 'female',
            accent: 'american',
            description: 'Warm and professional female voice'
          },
          {
            id: 'voice-2',
            name: 'David',
            gender: 'male',
            accent: 'american',
            description: 'Clear and confident male voice'
          },
          {
            id: 'voice-3',
            name: 'Emma',
            gender: 'female',
            accent: 'british',
            description: 'Elegant British female voice'
          },
          {
            id: 'voice-4',
            name: 'Alex',
            gender: 'male',
            accent: 'american',
            description: 'Energetic and youthful male voice'
          }
        ];
      }

      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      return response.data.voices.map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        gender: this.inferGender(voice.name),
        accent: voice.labels?.accent || 'american',
        description: voice.description || `${voice.name} voice`,
        previewUrl: voice.preview_url
      }));
    } catch (error: any) {
      console.error('ElevenLabs API Error:', error.response?.data || error.message);
      throw new AppError('Failed to fetch voices from ElevenLabs', 500);
    }
  }

  /**
   * Generate voiceover from text using ElevenLabs
   */
  async generateVoiceover(request: VoiceoverRequest): Promise<Buffer> {
    try {
      const { script, voiceId, speed = 1.0, stability = 0.5 } = request;

      // If using mock key, return a mock buffer
      if (this.apiKey === 'mock-key') {
        console.log('🎵 Generating mock voiceover for demo...');
        // Return a small buffer representing fake audio data
        return Buffer.from('mock-audio-data-for-demo-purposes');
      }

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          text: script,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: Math.max(0, Math.min(1, stability)),
            similarity_boost: 0.5,
            style: 0.5,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          responseType: 'arraybuffer'
        }
      );

      return Buffer.from(response.data);
    } catch (error: any) {
      console.error('ElevenLabs TTS Error:', error.response?.data || error.message);
      throw new AppError('Failed to generate voiceover', 500);
    }
  }

  /**
   * Save audio buffer to file and return file path
   */
  async saveAudioFile(audioBuffer: Buffer, filename: string): Promise<string> {
    try {
      const uploadsDir = path.join(process.cwd(), 'uploads', 'audio');
      
      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, `${filename}.mp3`);
      fs.writeFileSync(filePath, audioBuffer);

      return filePath;
    } catch (error: any) {
      console.error('File save error:', error);
      throw new AppError('Failed to save audio file', 500);
    }
  }

  /**
   * Get audio duration using a simple method (estimate based on text length)
   * In production, you'd use a proper audio analysis library
   */
  estimateAudioDuration(script: string, speed: number = 1.0): number {
    // Average speaking rate: ~150 words per minute
    const words = script.split(' ').length;
    const baseMinutes = words / 150;
    const seconds = (baseMinutes * 60) / speed;
    
    // Add some buffer for natural pauses
    return Math.round(seconds * 1.1);
  }

  /**
   * Infer gender from voice name (simple heuristic)
   */
  private inferGender(name: string): 'male' | 'female' {
    const maleNames = ['adam', 'antoni', 'arnold', 'daniel', 'ethan', 'josh', 'sam'];
    const femalNames = ['bella', 'domi', 'elli', 'emily', 'grace', 'rachel', 'sarah'];
    
    const lowerName = name.toLowerCase();
    
    if (maleNames.some(male => lowerName.includes(male))) {
      return 'male';
    }
    if (femalNames.some(female => lowerName.includes(female))) {
      return 'female';
    }
    
    // Default fallback
    return 'female';
  }
}

export default new ElevenLabsService();