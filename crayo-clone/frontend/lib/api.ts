import axios from 'axios';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error codes
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      console.error('API Error:', message);
    }
    return Promise.reject(error);
  }
);

// Script API
export const scriptAPI = {
  generate: async (data: {
    prompt?: string;
    youtubeUrl?: string;
    maxWords?: number;
    tone?: 'casual' | 'professional' | 'funny' | 'educational' | 'motivational';
  }) => {
    const response = await api.post('/script/generate', data);
    return response.data;
  },
  
  extractTranscript: async (url: string) => {
    const response = await api.post('/script/transcript', { url });
    return response.data;
  },
};

// Voiceover API
export const voiceoverAPI = {
  getVoices: async () => {
    const response = await api.get('/voiceover/voices');
    return response.data;
  },
  
  generate: async (data: {
    text: string;
    voiceId: string;
    speed?: number;
    pitch?: number;
  }) => {
    const response = await api.post('/voiceover/generate', data);
    return response.data;
  },
  
  preview: async (voiceId: string) => {
    const response = await api.get(`/voiceover/preview/${voiceId}`);
    return response.data;
  },
};

// Video API
export const videoAPI = {
  getBackgrounds: async () => {
    const response = await api.get('/video/backgrounds');
    return response.data;
  },
  
  getMusic: async () => {
    const response = await api.get('/video/music');
    return response.data;
  },
  
  autoSelectBackground: async (script: string) => {
    const response = await api.post('/video/auto-select-background', { script });
    return response.data;
  },
  
  generate: async (data: {
    script: string;
    voiceoverUrl: string;
    backgroundVideoId: string;
    backgroundMusicId: string;
    captionStyle?: {
      fontFamily: string;
      fontSize: number;
      fontColor: string;
      backgroundColor?: string;
      animation: 'fade' | 'slide' | 'pop' | 'none';
      position: 'center' | 'bottom' | 'top';
    };
    musicVolume?: number;
  }) => {
    const response = await api.post('/video/generate', data);
    return response.data;
  },
  
  generateCaptions: async (script: string, duration: number) => {
    const response = await api.post('/video/captions', { script, duration });
    return response.data;
  },
};