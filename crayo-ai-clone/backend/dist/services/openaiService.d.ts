import { ScriptGenerationRequest } from '../types';
declare class OpenAIService {
    private openai;
    constructor();
    /**
     * Generate a script for short-form video content
     */
    generateScript(request: ScriptGenerationRequest): Promise<string>;
    /**
     * Generate captions with timing from script
     */
    generateCaptions(script: string, audioDuration: number): Promise<Array<{
        text: string;
        startTime: number;
        endTime: number;
    }>>;
}
declare const _default: OpenAIService;
export default _default;
//# sourceMappingURL=openaiService.d.ts.map