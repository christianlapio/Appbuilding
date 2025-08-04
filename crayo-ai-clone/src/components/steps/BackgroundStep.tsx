'use client';

import { useState, useEffect } from 'react';
import { ProjectState, BackgroundVideo, Music } from '@/types';
import { Image, Music as MusicIcon, ArrowRight, ArrowLeft, Loader2, Play, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';

interface BackgroundStepProps {
  projectState: ProjectState;
  updateProjectState: (updates: Partial<ProjectState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function BackgroundStep({ projectState, updateProjectState, onNext, onPrev }: BackgroundStepProps) {
  const [videos, setVideos] = useState<BackgroundVideo[]>([]);
  const [musicTracks, setMusicTracks] = useState<Music[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<BackgroundVideo | null>(projectState.selectedBackgroundVideo);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(projectState.selectedMusic);
  const [activeTab, setActiveTab] = useState<'video' | 'music'>('video');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setIsLoading(true);
      const [videosResponse, musicResponse] = await Promise.all([
        apiClient.getBackgroundVideos(),
        apiClient.getMusicTracks()
      ]);

      if (videosResponse.success && videosResponse.data && typeof videosResponse.data === 'object' && 'videos' in videosResponse.data) {
        setVideos(videosResponse.data.videos as BackgroundVideo[]);
      }

      if (musicResponse.success && musicResponse.data && typeof musicResponse.data === 'object' && 'tracks' in musicResponse.data) {
        setMusicTracks(musicResponse.data.tracks as Music[]);
      }
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSelect = (video: BackgroundVideo) => {
    setSelectedVideo(video);
    updateProjectState({ selectedBackgroundVideo: video });
  };

  const handleMusicSelect = (music: Music) => {
    setSelectedMusic(music);
    updateProjectState({ selectedMusic: music });
  };

  const handleNext = () => {
    if (!selectedVideo) {
      toast.error('Please select a background video');
      return;
    }
    onNext();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading background assets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Background & Music
          </h2>
          <p className="text-gray-600">
            Select a background video and optional music to enhance your content.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('video')}
            className={`
              flex-1 py-2 px-4 rounded-md font-medium transition-colors
              ${activeTab === 'video'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <Image className="w-4 h-4 inline mr-2" />
            Background Video
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`
              flex-1 py-2 px-4 rounded-md font-medium transition-colors
              ${activeTab === 'music'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <MusicIcon className="w-4 h-4 inline mr-2" />
            Background Music
          </button>
        </div>

        {/* Content */}
        {activeTab === 'video' ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Select Background Video
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className={`
                    relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200
                    ${selectedVideo?.id === video.id
                      ? 'ring-4 ring-indigo-500 shadow-lg'
                      : 'hover:shadow-md'
                    }
                  `}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="aspect-[9/16] bg-gray-200 relative">
                    {/* Video thumbnail placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-80" />
                    </div>
                    
                    {/* Selection indicator */}
                    {selectedVideo?.id === video.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{video.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {video.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Select Background Music (Optional)
            </h3>
            <div className="space-y-4">
              {/* No music option */}
              <div
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all duration-200
                  ${!selectedMusic
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
                                 onClick={() => handleMusicSelect(null as unknown as Music)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">No Background Music</h4>
                    <p className="text-sm text-gray-600">Keep it simple with just voiceover</p>
                  </div>
                  <div className={`
                    w-4 h-4 rounded-full border-2
                    ${!selectedMusic
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                    }
                  `}>
                    {!selectedMusic && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Music tracks */}
              {musicTracks.map((track) => (
                <div
                  key={track.id}
                  className={`
                    p-4 border rounded-lg cursor-pointer transition-all duration-200
                    ${selectedMusic?.id === track.id
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }
                  `}
                  onClick={() => handleMusicSelect(track)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <MusicIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{track.title}</h4>
                        <p className="text-sm text-gray-600">{track.artist} • {track.genre}</p>
                        <p className="text-xs text-gray-500">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle music preview
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Volume2 className="w-4 h-4" />
                        <span>{Math.round(track.volume * 100)}%</span>
                      </div>
                      <div className={`
                        w-4 h-4 rounded-full border-2
                        ${selectedMusic?.id === track.id
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300'
                        }
                      `}>
                        {selectedMusic?.id === track.id && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Items Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Selected Assets:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Background Video:</p>
              <p className="text-sm text-gray-600">
                {selectedVideo ? selectedVideo.title : 'None selected'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Background Music:</p>
              <p className="text-sm text-gray-600">
                {selectedMusic ? selectedMusic.title : 'None selected'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onPrev}
            className="flex items-center space-x-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedVideo}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            <span>Preview & Generate</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}