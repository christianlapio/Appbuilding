export interface VideoProject {
  id: string;
  title: string;
  prompt: string;
  script: string;
  voiceId: string;
  backgroundVideoId: string;
  musicId: string;
  captions: Caption[];
  status: 'draft' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Caption {
  id: string;
  text: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  style: CaptionStyle;
}

export interface CaptionStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor?: string;
  position: 'top' | 'center' | 'bottom';
  animation: 'none' | 'fade' | 'slide' | 'bounce';
}

export interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  accent: string;
  description: string;
  previewUrl?: string;
}

export interface BackgroundVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  tags: string[];
}

export interface Music {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
  audioUrl: string;
  volume: number; // 0-1
}

export interface ScriptGenerationRequest {
  prompt: string;
  duration?: number; // target duration in seconds
  tone?: 'casual' | 'professional' | 'energetic' | 'calm';
}

export interface VoiceoverRequest {
  script: string;
  voiceId: string;
  speed?: number; // 0.5-2.0
  stability?: number; // 0-1
}

export interface VideoRenderRequest {
  projectId: string;
  script: string;
  voiceId: string;
  backgroundVideoId: string;
  musicId?: string;
  captions: Caption[];
  outputFormat: '9:16' | '16:9' | '1:1';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Frontend-specific types
export interface StepProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

export interface ProjectState {
  prompt: string;
  script: string;
  selectedVoice: Voice | null;
  selectedBackgroundVideo: BackgroundVideo | null;
  selectedMusic: Music | null;
  captions: Caption[];
  audioUrl: string;
  audioDuration: number;
}

export interface GenerationStatus {
  isGenerating: boolean;
  currentTask: string;
  progress: number;
}