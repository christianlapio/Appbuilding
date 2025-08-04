import { Router, Request, Response } from 'express';
import { ApiResponse, BackgroundVideo, Music } from '../types';
import path from 'path';
import express from 'express';

const router = Router();

// Serve static files from uploads directory
router.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/**
 * GET /api/assets/background-videos
 * Get available background videos
 */
router.get('/background-videos', (req: Request, res: Response<ApiResponse>) => {
  // Mock data for now - in production, this would come from a database or cloud storage
  const backgroundVideos: BackgroundVideo[] = [
    {
      id: 'bg-1',
      title: 'City Skyline',
      description: 'Modern city skyline with moving clouds',
      thumbnailUrl: '/assets/thumbnails/city-skyline.jpg',
      videoUrl: '/assets/videos/city-skyline.mp4',
      duration: 60,
      tags: ['urban', 'modern', 'business', 'technology']
    },
    {
      id: 'bg-2',
      title: 'Nature Forest',
      description: 'Peaceful forest with sunlight filtering through trees',
      thumbnailUrl: '/assets/thumbnails/nature-forest.jpg',
      videoUrl: '/assets/videos/nature-forest.mp4',
      duration: 45,
      tags: ['nature', 'peaceful', 'green', 'wellness']
    },
    {
      id: 'bg-3',
      title: 'Ocean Waves',
      description: 'Calming ocean waves on a beach',
      thumbnailUrl: '/assets/thumbnails/ocean-waves.jpg',
      videoUrl: '/assets/videos/ocean-waves.mp4',
      duration: 90,
      tags: ['ocean', 'calm', 'beach', 'meditation']
    },
    {
      id: 'bg-4',
      title: 'Abstract Particles',
      description: 'Colorful abstract particles floating',
      thumbnailUrl: '/assets/thumbnails/abstract-particles.jpg',
      videoUrl: '/assets/videos/abstract-particles.mp4',
      duration: 120,
      tags: ['abstract', 'colorful', 'tech', 'creative']
    },
    {
      id: 'bg-5',
      title: 'Workspace Setup',
      description: 'Modern workspace with laptop and coffee',
      thumbnailUrl: '/assets/thumbnails/workspace.jpg',
      videoUrl: '/assets/videos/workspace.mp4',
      duration: 75,
      tags: ['workspace', 'productivity', 'business', 'minimal']
    }
  ];

  res.json({
    success: true,
    data: { videos: backgroundVideos },
    message: 'Background videos retrieved successfully'
  });
});

/**
 * GET /api/assets/music
 * Get available background music tracks
 */
router.get('/music', (req: Request, res: Response<ApiResponse>) => {
  // Mock data for now - in production, this would come from a database or cloud storage
  const musicTracks: Music[] = [
    {
      id: 'music-1',
      title: 'Upbeat Corporate',
      artist: 'AudioLibrary',
      genre: 'Corporate',
      duration: 180,
      audioUrl: '/assets/music/upbeat-corporate.mp3',
      volume: 0.3
    },
    {
      id: 'music-2',
      title: 'Chill Vibes',
      artist: 'SoundTrack',
      genre: 'Ambient',
      duration: 240,
      audioUrl: '/assets/music/chill-vibes.mp3',
      volume: 0.25
    },
    {
      id: 'music-3',
      title: 'Energetic Beat',
      artist: 'BeatMaker',
      genre: 'Electronic',
      duration: 150,
      audioUrl: '/assets/music/energetic-beat.mp3',
      volume: 0.4
    },
    {
      id: 'music-4',
      title: 'Peaceful Piano',
      artist: 'Composer',
      genre: 'Classical',
      duration: 200,
      audioUrl: '/assets/music/peaceful-piano.mp3',
      volume: 0.2
    },
    {
      id: 'music-5',
      title: 'Tech Innovation',
      artist: 'FutureSounds',
      genre: 'Tech',
      duration: 160,
      audioUrl: '/assets/music/tech-innovation.mp3',
      volume: 0.35
    }
  ];

  res.json({
    success: true,
    data: { tracks: musicTracks },
    message: 'Music tracks retrieved successfully'
  });
});

/**
 * GET /api/assets/background-videos/search
 * Search background videos by keywords
 */
router.get('/background-videos/search', (req: Request, res: Response<ApiResponse>) => {
  const { keywords } = req.query;
  
  if (!keywords || typeof keywords !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Keywords parameter is required'
    });
  }

  // This is a simple mock implementation
  // In production, you'd implement proper search with a database or search engine
  const allVideos: BackgroundVideo[] = [
    {
      id: 'bg-1',
      title: 'City Skyline',
      description: 'Modern city skyline with moving clouds',
      thumbnailUrl: '/assets/thumbnails/city-skyline.jpg',
      videoUrl: '/assets/videos/city-skyline.mp4',
      duration: 60,
      tags: ['urban', 'modern', 'business', 'technology']
    },
    // ... other videos would be here
  ];

  const searchTerms = keywords.toLowerCase().split(' ');
  const matchingVideos = allVideos.filter(video => 
    searchTerms.some(term => 
      video.title.toLowerCase().includes(term) ||
      video.description.toLowerCase().includes(term) ||
      video.tags.some(tag => tag.toLowerCase().includes(term))
    )
  );

  res.json({
    success: true,
    data: { 
      videos: matchingVideos,
      searchKeywords: keywords
    },
    message: `Found ${matchingVideos.length} videos matching "${keywords}"`
  });
});

export default router;