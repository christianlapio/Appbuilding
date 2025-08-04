'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Music, Play, Volume2 } from 'lucide-react';
import { VideoProject, BackgroundVideo, BackgroundMusic } from '@/types';

interface VideoCustomizationProps {
  project: Partial<VideoProject>;
  onUpdate: (updates: Partial<VideoProject>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Mock data for backgrounds and music
const BACKGROUND_VIDEOS: BackgroundVideo[] = [
  {
    id: '1',
    name: 'Abstract Waves',
    path: '/backgrounds/abstract-waves.mp4',
    thumbnail: '/thumbnails/abstract-waves.jpg',
    category: 'abstract'
  },
  {
    id: '2',
    name: 'Nature Forest',
    path: '/backgrounds/nature-forest.mp4',
    thumbnail: '/thumbnails/nature-forest.jpg',
    category: 'nature'
  },
  {
    id: '3',
    name: 'Urban City',
    path: '/backgrounds/urban-city.mp4',
    thumbnail: '/thumbnails/urban-city.jpg',
    category: 'urban'
  },
  {
    id: '4',
    name: 'Tech Circuit',
    path: '/backgrounds/tech-circuit.mp4',
    thumbnail: '/thumbnails/tech-circuit.jpg',
    category: 'technology'
  },
  {
    id: '5',
    name: 'Gradient Flow',
    path: '/backgrounds/gradient-flow.mp4',
    thumbnail: '/thumbnails/gradient-flow.jpg',
    category: 'abstract'
  },
  {
    id: '6',
    name: 'Ocean Waves',
    path: '/backgrounds/ocean-waves.mp4',
    thumbnail: '/thumbnails/ocean-waves.jpg',
    category: 'nature'
  }
];

const BACKGROUND_MUSIC: BackgroundMusic[] = [
  {
    id: '1',
    name: 'Upbeat Energy',
    path: '/music/upbeat-energy.mp3',
    duration: 60,
    category: 'energetic'
  },
  {
    id: '2',
    name: 'Calm Meditation',
    path: '/music/calm-meditation.mp3',
    duration: 60,
    category: 'calm'
  },
  {
    id: '3',
    name: 'Tech Innovation',
    path: '/music/tech-innovation.mp3',
    duration: 60,
    category: 'technology'
  },
  {
    id: '4',
    name: 'Motivational',
    path: '/music/motivational.mp3',
    duration: 60,
    category: 'motivational'
  },
  {
    id: '5',
    name: 'Ambient Space',
    path: '/music/ambient-space.mp3',
    duration: 60,
    category: 'ambient'
  },
  {
    id: '6',
    name: 'Corporate Professional',
    path: '/music/corporate-professional.mp3',
    duration: 60,
    category: 'professional'
  }
];

export default function VideoCustomization({ project, onUpdate, onNext, onPrevious }: VideoCustomizationProps) {
  const [selectedBackground, setSelectedBackground] = useState<BackgroundVideo | undefined>(project.backgroundVideo);
  const [selectedMusic, setSelectedMusic] = useState<BackgroundMusic | undefined>(project.backgroundMusic);
  const [activeTab, setActiveTab] = useState<'background' | 'music'>('background');

  const handleBackgroundSelect = (background: BackgroundVideo) => {
    setSelectedBackground(background);
    onUpdate({ backgroundVideo: background });
  };

  const handleMusicSelect = (music: BackgroundMusic) => {
    setSelectedMusic(music);
    onUpdate({ backgroundMusic: music });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Customize Your Video
        </h2>
        <p className="text-lg text-gray-600">
          Add background videos and music to enhance your content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Background Videos */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Image className="w-5 h-5 mr-2 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Background Videos</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {BACKGROUND_VIDEOS.map((background) => (
              <motion.div
                key={background.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedBackground?.id === background.id
                    ? 'border-purple-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleBackgroundSelect(background)}
              >
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Play className="w-8 h-8 text-purple-600" />
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium text-gray-900">{background.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{background.category}</p>
                </div>
                {selectedBackground?.id === background.id && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Selected:</strong> {selectedBackground?.name || 'None'}
            </p>
          </div>
        </div>

        {/* Background Music */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Music className="w-5 h-5 mr-2 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Background Music</h3>
          </div>
          
          <div className="space-y-3">
            {BACKGROUND_MUSIC.map((music) => (
              <motion.div
                key={music.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedMusic?.id === music.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMusicSelect(music)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Volume2 className="w-4 h-4 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{music.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{music.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{music.duration}s</span>
                    {selectedMusic?.id === music.id && (
                      <div className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Selected:</strong> {selectedMusic?.name || 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* Video Preview */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Preview</h3>
        <div className="aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600">Video preview will appear here</p>
            <p className="text-sm text-gray-500 mt-2">9:16 aspect ratio for social media</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Continue to Preview & Export
        </button>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">🎨 Customization Tips</h3>
        <ul className="text-blue-800 space-y-2">
          <li>• Choose backgrounds that complement your content theme</li>
          <li>• Background music should enhance, not overpower your voiceover</li>
          <li>• Consider your target platform's requirements (TikTok, Instagram, YouTube)</li>
          <li>• Test different combinations to find the perfect match</li>
        </ul>
      </div>
    </div>
  );
}