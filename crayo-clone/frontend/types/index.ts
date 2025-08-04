// Script generation types
export interface ScriptData {
  script: string;
  title: string;
  duration: number;
  wordCount: number;
}

// Voice types
export interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  accent: string;
  description: string;
  previewUrl?: string;
}

// Voiceover types
export interface VoiceoverData {
  audioUrl: string;
  duration: number;
  voiceId: string;
}

// Background video types
export interface BackgroundVideo {
  id: string;
  name: string;
  url: string;
  duration: number;
  tags: string[];
  thumbnail: string;
}

// Background music types
export interface BackgroundMusic {
  id: string;
  name: string;
  url: string;
  duration: number;
  genre: string;
  mood: string;
}

// Caption style types
export interface CaptionStyle {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  backgroundColor?: string;
  animation: 'fade' | 'slide' | 'pop' | 'none';
  position: 'center' | 'bottom' | 'top';
}

// Video generation types
export interface VideoData {
  videoUrl: string;
  duration: number;
  format: string;
  resolution: string;
}

// Project state types
export interface ProjectState {
  // Step 1: Script
  prompt?: string;
  youtubeUrl?: string;
  tone: 'casual' | 'professional' | 'funny' | 'educational' | 'motivational';
  scriptData?: ScriptData;
  
  // Step 2: Voiceover
  selectedVoice?: Voice;
  voiceoverData?: VoiceoverData;
  
  // Step 3: Background
  selectedBackground?: BackgroundVideo;
  selectedMusic?: BackgroundMusic;
  musicVolume: number;
  
  // Step 4: Captions
  captionStyle: CaptionStyle;
  
  // Step 5: Final video
  videoData?: VideoData;
}

// Form step types
export type FormStep = 'script' | 'voiceover' | 'background' | 'captions' | 'export';