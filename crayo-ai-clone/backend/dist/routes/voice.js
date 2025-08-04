"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const elevenlabsService_1 = __importDefault(require("../services/elevenlabsService"));
const errorHandler_1 = require("../middleware/errorHandler");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
/**
 * GET /api/voice/list
 * Get available voices from ElevenLabs
 */
router.get('/list', async (req, res) => {
    try {
        const voices = await elevenlabsService_1.default.getVoices();
        res.json({
            success: true,
            data: { voices },
            message: 'Voices retrieved successfully'
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.AppError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message
            });
        }
        else {
            console.error('Voice list error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve voices'
            });
        }
    }
});
/**
 * POST /api/voice/generate
 * Generate voiceover from script using ElevenLabs
 */
router.post('/generate', async (req, res) => {
    try {
        const { script, voiceId, speed, stability } = req.body;
        // Validation
        if (!script || script.trim().length === 0) {
            throw new errorHandler_1.AppError('Script is required', 400);
        }
        if (!voiceId) {
            throw new errorHandler_1.AppError('Voice ID is required', 400);
        }
        if (script.length > 5000) {
            throw new errorHandler_1.AppError('Script must be less than 5000 characters', 400);
        }
        if (speed && (speed < 0.5 || speed > 2.0)) {
            throw new errorHandler_1.AppError('Speed must be between 0.5 and 2.0', 400);
        }
        if (stability && (stability < 0 || stability > 1)) {
            throw new errorHandler_1.AppError('Stability must be between 0 and 1', 400);
        }
        // Generate voiceover
        const audioBuffer = await elevenlabsService_1.default.generateVoiceover({
            script: script.trim(),
            voiceId,
            speed,
            stability
        });
        // Save audio file
        const filename = `voiceover_${(0, uuid_1.v4)()}`;
        const filePath = await elevenlabsService_1.default.saveAudioFile(audioBuffer, filename);
        // Estimate duration
        const estimatedDuration = elevenlabsService_1.default.estimateAudioDuration(script, speed || 1.0);
        res.json({
            success: true,
            data: {
                audioUrl: `/uploads/audio/${filename}.mp3`,
                filePath,
                duration: estimatedDuration,
                voiceId,
                script: script.trim()
            },
            message: 'Voiceover generated successfully'
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.AppError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message
            });
        }
        else {
            console.error('Voiceover generation error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate voiceover'
            });
        }
    }
});
exports.default = router;
//# sourceMappingURL=voice.js.map