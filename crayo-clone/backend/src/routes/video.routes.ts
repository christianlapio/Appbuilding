import { Router } from 'express';
import videoController from '../controllers/video.controller';

const router = Router();

// Get background videos
router.get('/backgrounds', videoController.getBackgroundVideos);

// Get background music
router.get('/music', videoController.getBackgroundMusic);

// Auto-select background based on script
router.post('/auto-select-background', videoController.autoSelectBackground);

// Generate final video
router.post('/generate', videoController.generateVideo);

// Generate captions
router.post('/captions', videoController.generateCaptions);

export default router;