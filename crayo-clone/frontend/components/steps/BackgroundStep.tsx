"use client";

import { useState, useEffect } from 'react';
import { Film, Music, Volume2, Loader2, Sparkles, Check } from 'lucide-react';
import { ProjectState, BackgroundVideo, BackgroundMusic } from '@/types';
import { videoAPI } from '@/lib/api';

interface BackgroundStepProps {
  projectState: ProjectState;
  updateProjectState: (updates: Partial<ProjectState>) => void;
}

export default function BackgroundStep({ projectState, updateProjectState }: BackgroundStepProps) {
  const [videos, setVideos] = useState<BackgroundVideo[]>([]);
  const [music, setMusic] = useState<BackgroundMusic[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<BackgroundVideo | null>(projectState.selectedBackground || null);
  const [selectedMusic, setSelectedMusic] = useState<BackgroundMusic | null>(projectState.selectedMusic || null);
  const [musicVolume, setMusicVolume] = useState(projectState.musicVolume);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'video' | 'music'>('video');

  useEffect(() => {
    fetchBackgroundAssets();
  }, []);

  const fetchBackgroundAssets = async () => {
    try {
      const [videosResponse, musicResponse] = await Promise.all([
        videoAPI.getBackgrounds(),
        videoAPI.getMusic()
      ]);

      if (videosResponse.success) {
        setVideos(videosResponse.data);
      }
      if (musicResponse.success) {
        setMusic(musicResponse.data);
      }
    } catch (err) {
      setError('Failed to load background assets');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoSelect = async () => {
    if (!projectState.scriptData) return;

    try {
      const response = await videoAPI.autoSelectBackground(projectState.scriptData.script);
      if (response.success) {
        setSelectedVideo(response.data);
        updateProjectState({ selectedBackground: response.data });
      }
    } catch (err) {
      setError('Failed to auto-select background');
      console.error(err);
    }
  };

  const handleVideoSelect = (video: BackgroundVideo) => {
    setSelectedVideo(video);
    updateProjectState({ selectedBackground: video });
  };

  const handleMusicSelect = (musicItem: BackgroundMusic) => {
    setSelectedMusic(musicItem);
    updateProjectState({ selectedMusic: musicItem });
  };

  const handleVolumeChange = (volume: number) => {
    setMusicVolume(volume);
    updateProjectState({ musicVolume: volume });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg">
        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'video'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Film className="h-4 w-4" />
          <span>Background Video</span>
        </button>
        <button
          onClick={() => setActiveTab('music')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'music'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Music className="h-4 w-4" />
          <span>Background Music</span>
        </button>
      </div>

      {activeTab === 'video' ? (
        <div className="space-y-4">
          {/* Auto-select Button */}
          <button
            onClick={handleAutoSelect}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-purple-600 rounded-lg text-purple-400 hover:bg-purple-600/10 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>Auto-Select Based on Script</span>
          </button>

          {/* Video Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                className={`
                  relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer transition-all
                  ${selectedVideo?.id === video.id
                    ? 'ring-2 ring-purple-600 ring-offset-2 ring-offset-gray-900'
                    : 'hover:opacity-80'
                  }
                `}
              >
                {/* Thumbnail placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="h-12 w-12 text-gray-600" />
                </div>
                
                {/* Video info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <h4 className="font-medium text-sm">{video.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {video.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-800 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Selected indicator */}
                {selectedVideo?.id === video.id && (
                  <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Music Selection */}
          <div className="space-y-2">
            {music.map((musicItem) => (
              <div
                key={musicItem.id}
                onClick={() => handleMusicSelect(musicItem)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedMusic?.id === musicItem.id
                    ? 'border-purple-600 bg-purple-600/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{musicItem.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {musicItem.genre} • {musicItem.mood} mood
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Music className="h-5 w-5 text-gray-400" />
                    {selectedMusic?.id === musicItem.id && (
                      <Check className="h-5 w-5 text-purple-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Volume Control */}
          {selectedMusic && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Music Volume</label>
                <span className="text-sm text-gray-400">{Math.round(musicVolume * 100)}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <Volume2 className="h-5 w-5 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume * 100}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value) / 100)}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Summary */}
      {selectedVideo && selectedMusic && (
        <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
          <h3 className="font-medium mb-2">Selected Background</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-400">Video:</span> {selectedVideo.name}
            </p>
            <p>
              <span className="text-gray-400">Music:</span> {selectedMusic.name} ({Math.round(musicVolume * 100)}% volume)
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #9333ea;
          cursor: pointer;
          border-radius: 50%;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #9333ea;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  );
}