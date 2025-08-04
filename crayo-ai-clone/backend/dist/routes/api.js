"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const script_1 = __importDefault(require("./script"));
const voice_1 = __importDefault(require("./voice"));
const video_1 = __importDefault(require("./video"));
const assets_1 = __importDefault(require("./assets"));
const router = (0, express_1.Router)();
// API route groups
router.use('/script', script_1.default);
router.use('/voice', voice_1.default);
router.use('/video', video_1.default);
router.use('/assets', assets_1.default);
// API info endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Crayo AI Clone API',
        version: '1.0.0',
        endpoints: {
            script: '/api/script',
            voice: '/api/voice',
            video: '/api/video',
            assets: '/api/assets'
        }
    });
});
exports.default = router;
//# sourceMappingURL=api.js.map