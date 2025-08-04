import { Router } from 'express';
import scriptRoutes from './script';
import voiceRoutes from './voice';
import videoRoutes from './video';
import assetsRoutes from './assets';

const router = Router();

// API route groups
router.use('/script', scriptRoutes);
router.use('/voice', voiceRoutes);
router.use('/video', videoRoutes);
router.use('/assets', assetsRoutes);

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

export default router;