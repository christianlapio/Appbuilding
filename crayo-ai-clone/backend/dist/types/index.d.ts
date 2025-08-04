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
    startTime: number;
    endTime: number;
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
    volume: number;
}
export interface ScriptGenerationRequest {
    prompt: string;
    duration?: number;
    tone?: 'casual' | 'professional' | 'energetic' | 'calm';
}
export interface VoiceoverRequest {
    script: string;
    voiceId: string;
    speed?: number;
    stability?: number;
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
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
//# sourceMappingURL=index.d.ts.map