import axios from 'axios';
import { ApiResponse, ScriptGenerationRequest, VoiceoverRequest, VideoRenderRequest } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const apiClient = {
  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response = await api.get('/health');
    return response.data;
  },

  // Script generation
  async generateScript(request: ScriptGenerationRequest): Promise<ApiResponse> {
    const response = await api.post('/script/generate', request);
    return response.data;
  },

  async generateCaptions(script: string, audioDuration: number): Promise<ApiResponse> {
    const response = await api.post('/script/captions', { script, audioDuration });
    return response.data;
  },

  // Voice services
  async getVoices(): Promise<ApiResponse> {
    const response = await api.get('/voice/list');
    return response.data;
  },

  async generateVoiceover(request: VoiceoverRequest): Promise<ApiResponse> {
    const response = await api.post('/voice/generate', request);
    return response.data;
  },

  // Assets
  async getBackgroundVideos(): Promise<ApiResponse> {
    const response = await api.get('/assets/background-videos');
    return response.data;
  },

  async searchBackgroundVideos(keywords: string): Promise<ApiResponse> {
    const response = await api.get(`/assets/background-videos/search?keywords=${encodeURIComponent(keywords)}`);
    return response.data;
  },

  async getMusicTracks(): Promise<ApiResponse> {
    const response = await api.get('/assets/music');
    return response.data;
  },

  // Video rendering
  async renderVideo(request: VideoRenderRequest): Promise<ApiResponse> {
    const response = await api.post('/video/render', request);
    return response.data;
  },

  async getVideoStatus(jobId: string): Promise<ApiResponse> {
    const response = await api.get(`/video/status/${jobId}`);
    return response.data;
  },

  async downloadVideo(jobId: string): Promise<Blob> {
    const response = await api.get(`/video/download/${jobId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default apiClient;