import { Router } from 'express';
import voiceoverController from '../controllers/voiceover.controller';

const router = Router();

// Get available voices
router.get('/voices', voiceoverController.getVoices);

// Generate voiceover
router.post('/generate', voiceoverController.generateVoiceover);

// Preview a specific voice
router.get('/preview/:voiceId', voiceoverController.previewVoice);

export default router;