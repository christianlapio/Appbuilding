import { Router } from 'express';
import scriptController from '../controllers/script.controller';

const router = Router();

// Generate script from prompt or YouTube URL
router.post('/generate', scriptController.generateScript);

// Extract transcript from YouTube URL
router.post('/transcript', scriptController.extractTranscript);

export default router;