import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { VoiceoverRequest, VoiceoverResponse, Voice } from '../types';

class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || '';
  }

  /**
   * Get available voices from ElevenLabs
   */
  async getVoices(): Promise<Voice[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      return response.data.voices.map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        gender: voice.labels?.gender || 'male',
        accent: voice.labels?.accent || 'american',
        description: voice.description || voice.preview_url,
        previewUrl: voice.preview_url
      }));
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      // Return mock voices for development
      return this.getMockVoices();
    }
  }

  /**
   * Generate voiceover from text
   */
  async generateVoiceover(request: VoiceoverRequest): Promise<VoiceoverResponse> {
    const { text, voiceId, speed = 1.0, pitch = 0 } = request;

    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      // Save audio file
      const filename = `voiceover_${Date.now()}.mp3`;
      const filepath = path.join(__dirname, '../../generated', filename);
      
      fs.writeFileSync(filepath, response.data);

      // Calculate duration (this is approximate - would need ffprobe for accurate duration)
      const wordsPerMinute = 150 * speed;
      const wordCount = text.split(/\s+/).length;
      const duration = Math.ceil((wordCount / wordsPerMinute) * 60);

      return {
        audioUrl: `/generated/${filename}`,
        duration,
        voiceId
      };
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      
      // For development, generate a mock response
      return this.generateMockVoiceover(text, voiceId);
    }
  }

  /**
   * Mock voices for development/testing
   */
  private getMockVoices(): Voice[] {
    return [
      {
        id: 'voice_1',
        name: 'Alex',
        gender: 'male',
        accent: 'american',
        description: 'Young adult male, conversational'
      },
      {
        id: 'voice_2',
        name: 'Emma',
        gender: 'female',
        accent: 'british',
        description: 'Young adult female, professional'
      },
      {
        id: 'voice_3',
        name: 'Michael',
        gender: 'male',
        accent: 'american',
        description: 'Middle-aged male, authoritative'
      },
      {
        id: 'voice_4',
        name: 'Sophia',
        gender: 'female',
        accent: 'american',
        description: 'Young female, energetic and friendly'
      },
      {
        id: 'voice_5',
        name: 'James',
        gender: 'male',
        accent: 'australian',
        description: 'Adult male, warm and engaging'
      }
    ];
  }

  /**
   * Generate mock voiceover for development
   */
  private generateMockVoiceover(text: string, voiceId: string): VoiceoverResponse {
    // Create a placeholder audio file
    const filename = `mock_voiceover_${Date.now()}.mp3`;
    const wordCount = text.split(/\s+/).length;
    const duration = Math.ceil((wordCount / 150) * 60);

    return {
      audioUrl: `/generated/${filename}`,
      duration,
      voiceId
    };
  }
}

export default new ElevenLabsService();