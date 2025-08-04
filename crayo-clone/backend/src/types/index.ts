// Script generation types
export interface ScriptGenerationRequest {
  prompt?: string;
  youtubeUrl?: string;
  maxWords?: number;
  tone?: 'casual' | 'professional' | 'funny' | 'educational' | 'motivational';
}

export interface ScriptGenerationResponse {
  script: string;
  title: string;
  duration: number; // estimated duration in seconds
  wordCount: number;
}

// Voiceover types
export interface VoiceoverRequest {
  text: string;
  voiceId: string;
  speed?: number; // 0.5 to 2.0
  pitch?: number; // -20 to 20
}

export interface VoiceoverResponse {
  audioUrl: string;
  duration: number;
  voiceId: string;
}

// Available voices
export interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  accent: string;
  description: string;
  previewUrl?: string;
}

// Video generation types
export interface VideoGenerationRequest {
  script: string;
  voiceoverUrl: string;
  backgroundVideoId: string;
  backgroundMusicId: string;
  captionStyle: CaptionStyle;
  musicVolume?: number; // 0 to 1
}

export interface CaptionStyle {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  backgroundColor?: string;
  animation: 'fade' | 'slide' | 'pop' | 'none';
  position: 'center' | 'bottom' | 'top';
}

export interface VideoGenerationResponse {
  videoUrl: string;
  duration: number;
  format: string;
  resolution: string;
}

// Background media types
export interface BackgroundVideo {
  id: string;
  name: string;
  url: string;
  duration: number;
  tags: string[];
  thumbnail: string;
}

export interface BackgroundMusic {
  id: string;
  name: string;
  url: string;
  duration: number;
  genre: string;
  mood: string;
}