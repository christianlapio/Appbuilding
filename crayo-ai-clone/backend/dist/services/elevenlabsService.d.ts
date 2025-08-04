import { VoiceoverRequest, Voice } from '../types';
declare class ElevenLabsService {
    private apiKey;
    private baseUrl;
    constructor();
    /**
     * Get available voices from ElevenLabs
     */
    getVoices(): Promise<Voice[]>;
    /**
     * Generate voiceover from text using ElevenLabs
     */
    generateVoiceover(request: VoiceoverRequest): Promise<Buffer>;
    /**
     * Save audio buffer to file and return file path
     */
    saveAudioFile(audioBuffer: Buffer, filename: string): Promise<string>;
    /**
     * Get audio duration using a simple method (estimate based on text length)
     * In production, you'd use a proper audio analysis library
     */
    estimateAudioDuration(script: string, speed?: number): number;
    /**
     * Infer gender from voice name (simple heuristic)
     */
    private inferGender;
}
declare const _default: ElevenLabsService;
export default _default;
//# sourceMappingURL=elevenlabsService.d.ts.map