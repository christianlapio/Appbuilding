export interface Voice {
  id: string;
  name: string;
  description: string;
}

export interface Caption {
  text: string;
  startTime: number;
  endTime: number;
  y: number;
  style?: {
    fontSize?: number;
    color?: string;
    fontFamily?: string;
  };
}

export interface BackgroundVideo {
  id: string;
  name: string;
  path: string;
  thumbnail: string;
  category: string;
}

export interface BackgroundMusic {
  id: string;
  name: string;
  path: string;
  duration: number;
  category: string;
}

export interface VideoProject {
  id: string;
  name: string;
  script: string;
  voiceId: string;
  backgroundVideo?: BackgroundVideo;
  backgroundMusic?: BackgroundMusic;
  captions: Caption[];
  status: 'draft' | 'processing' | 'completed' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface ScriptGenerationRequest {
  prompt?: string;
  youtubeUrl?: string;
}

export interface VoiceoverGenerationRequest {
  script: string;
  voiceId?: string;
}

export interface VideoRenderRequest {
  audioBase64: string;
  backgroundVideo?: string;
  captions: Caption[];
  backgroundMusic?: string;
  outputFileName?: string;
}