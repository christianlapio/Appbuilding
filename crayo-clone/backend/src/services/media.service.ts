import { BackgroundVideo, BackgroundMusic } from '../types';

class MediaService {
  // Mock background videos - in production, these would come from a database or CDN
  private backgroundVideos: BackgroundVideo[] = [
    {
      id: 'bg_1',
      name: 'Tech Office',
      url: '/assets/videos/tech-office.mp4',
      duration: 60,
      tags: ['technology', 'office', 'professional', 'modern'],
      thumbnail: '/assets/thumbnails/tech-office.jpg'
    },
    {
      id: 'bg_2',
      name: 'Nature Walk',
      url: '/assets/videos/nature-walk.mp4',
      duration: 60,
      tags: ['nature', 'outdoor', 'peaceful', 'relaxing'],
      thumbnail: '/assets/thumbnails/nature-walk.jpg'
    },
    {
      id: 'bg_3',
      name: 'City Lights',
      url: '/assets/videos/city-lights.mp4',
      duration: 60,
      tags: ['urban', 'night', 'modern', 'dynamic'],
      thumbnail: '/assets/thumbnails/city-lights.jpg'
    },
    {
      id: 'bg_4',
      name: 'Abstract Motion',
      url: '/assets/videos/abstract-motion.mp4',
      duration: 60,
      tags: ['abstract', 'colorful', 'creative', 'modern'],
      thumbnail: '/assets/thumbnails/abstract-motion.jpg'
    },
    {
      id: 'bg_5',
      name: 'Fitness Workout',
      url: '/assets/videos/fitness-workout.mp4',
      duration: 60,
      tags: ['fitness', 'health', 'active', 'motivational'],
      thumbnail: '/assets/thumbnails/fitness-workout.jpg'
    }
  ];

  // Mock background music - in production, these would come from a database or CDN
  private backgroundMusic: BackgroundMusic[] = [
    {
      id: 'music_1',
      name: 'Upbeat Energy',
      url: '/assets/music/upbeat-energy.mp3',
      duration: 60,
      genre: 'electronic',
      mood: 'energetic'
    },
    {
      id: 'music_2',
      name: 'Chill Vibes',
      url: '/assets/music/chill-vibes.mp3',
      duration: 60,
      genre: 'lofi',
      mood: 'relaxed'
    },
    {
      id: 'music_3',
      name: 'Corporate Success',
      url: '/assets/music/corporate-success.mp3',
      duration: 60,
      genre: 'corporate',
      mood: 'professional'
    },
    {
      id: 'music_4',
      name: 'Epic Motivation',
      url: '/assets/music/epic-motivation.mp3',
      duration: 60,
      genre: 'cinematic',
      mood: 'inspirational'
    },
    {
      id: 'music_5',
      name: 'Happy Ukulele',
      url: '/assets/music/happy-ukulele.mp3',
      duration: 60,
      genre: 'acoustic',
      mood: 'cheerful'
    }
  ];

  /**
   * Get all background videos
   */
  async getBackgroundVideos(): Promise<BackgroundVideo[]> {
    return this.backgroundVideos;
  }

  /**
   * Get background video by ID
   */
  async getBackgroundVideoById(id: string): Promise<BackgroundVideo | null> {
    return this.backgroundVideos.find(video => video.id === id) || null;
  }

  /**
   * Get background videos by tags
   */
  async getBackgroundVideosByTags(tags: string[]): Promise<BackgroundVideo[]> {
    return this.backgroundVideos.filter(video => 
      tags.some(tag => video.tags.includes(tag.toLowerCase()))
    );
  }

  /**
   * Auto-select background video based on script keywords
   */
  async autoSelectBackgroundVideo(script: string): Promise<BackgroundVideo> {
    const keywords = this.extractKeywords(script);
    
    // Find videos matching keywords
    const matchingVideos = this.backgroundVideos.filter(video =>
      video.tags.some(tag => keywords.includes(tag))
    );

    // Return best match or random if no matches
    return matchingVideos.length > 0 
      ? matchingVideos[0] 
      : this.backgroundVideos[Math.floor(Math.random() * this.backgroundVideos.length)];
  }

  /**
   * Get all background music
   */
  async getBackgroundMusic(): Promise<BackgroundMusic[]> {
    return this.backgroundMusic;
  }

  /**
   * Get background music by ID
   */
  async getBackgroundMusicById(id: string): Promise<BackgroundMusic | null> {
    return this.backgroundMusic.find(music => music.id === id) || null;
  }

  /**
   * Get background music by mood
   */
  async getBackgroundMusicByMood(mood: string): Promise<BackgroundMusic[]> {
    return this.backgroundMusic.filter(music => 
      music.mood.toLowerCase() === mood.toLowerCase()
    );
  }

  /**
   * Extract keywords from script for auto-selection
   */
  private extractKeywords(script: string): string[] {
    const commonWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'as', 'are', 'was', 'were', 'to', 'in', 'for', 'of', 'with']);
    
    const words = script.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    // Look for specific keyword patterns
    const keywordPatterns = {
      technology: /tech|computer|software|digital|ai|innovation/i,
      nature: /nature|outdoor|forest|mountain|ocean|peaceful/i,
      fitness: /fitness|exercise|workout|health|gym|training/i,
      professional: /business|corporate|office|work|career|success/i,
      creative: /creative|art|design|color|abstract|imagination/i
    };

    const detectedKeywords: string[] = [];
    
    Object.entries(keywordPatterns).forEach(([keyword, pattern]) => {
      if (pattern.test(script)) {
        detectedKeywords.push(keyword);
      }
    });

    return detectedKeywords;
  }
}

export default new MediaService();