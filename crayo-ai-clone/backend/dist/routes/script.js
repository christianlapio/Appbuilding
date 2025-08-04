"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openaiService_1 = __importDefault(require("../services/openaiService"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
/**
 * POST /api/script/generate
 * Generate a script from a prompt using GPT-4
 */
router.post('/generate', async (req, res) => {
    try {
        const { prompt, duration, tone } = req.body;
        // Validation
        if (!prompt || prompt.trim().length === 0) {
            throw new errorHandler_1.AppError('Prompt is required', 400);
        }
        if (prompt.length > 500) {
            throw new errorHandler_1.AppError('Prompt must be less than 500 characters', 400);
        }
        if (duration && (duration < 15 || duration > 180)) {
            throw new errorHandler_1.AppError('Duration must be between 15 and 180 seconds', 400);
        }
        // Generate script
        const script = await openaiService_1.default.generateScript({
            prompt: prompt.trim(),
            duration,
            tone
        });
        res.json({
            success: true,
            data: {
                script,
                prompt,
                duration: duration || 60,
                tone: tone || 'energetic'
            },
            message: 'Script generated successfully'
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
            console.error('Script generation error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate script'
            });
        }
    }
});
/**
 * POST /api/script/captions
 * Generate captions with timing from script and audio duration
 */
router.post('/captions', async (req, res) => {
    try {
        const { script, audioDuration } = req.body;
        // Validation
        if (!script || script.trim().length === 0) {
            throw new errorHandler_1.AppError('Script is required', 400);
        }
        if (!audioDuration || audioDuration <= 0) {
            throw new errorHandler_1.AppError('Audio duration is required and must be positive', 400);
        }
        // Generate captions
        const captions = await openaiService_1.default.generateCaptions(script, audioDuration);
        res.json({
            success: true,
            data: {
                captions,
                script,
                audioDuration
            },
            message: 'Captions generated successfully'
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
            console.error('Caption generation error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate captions'
            });
        }
    }
});
exports.default = router;
//# sourceMappingURL=script.js.map