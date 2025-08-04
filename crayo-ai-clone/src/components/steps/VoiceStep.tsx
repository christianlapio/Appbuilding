'use client';

import { useState, useEffect } from 'react';
import { ProjectState, Voice } from '@/types';
import { Mic, ArrowRight, ArrowLeft, Loader2, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';

interface VoiceStepProps {
  projectState: ProjectState;
  updateProjectState: (updates: Partial<ProjectState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function VoiceStep({ projectState, updateProjectState, onNext, onPrev }: VoiceStepProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(projectState.selectedVoice);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getVoices();
      
      if (response.success && response.data && typeof response.data === 'object' && 'voices' in response.data) {
        setVoices(response.data.voices as Voice[]);
      } else {
        // Fallback to mock voices if API fails
        const mockVoices: Voice[] = [
          {
            id: 'voice-1',
            name: 'Sarah',
            gender: 'female',
            accent: 'american',
            description: 'Warm and professional female voice'
          },
          {
            id: 'voice-2',
            name: 'David',
            gender: 'male',
            accent: 'american',
            description: 'Clear and confident male voice'
          },
          {
            id: 'voice-3',
            name: 'Emma',
            gender: 'female',
            accent: 'british',
            description: 'Elegant British female voice'
          },
          {
            id: 'voice-4',
            name: 'Alex',
            gender: 'male',
            accent: 'american',
            description: 'Energetic and youthful male voice'
          }
        ];
        setVoices(mockVoices);
        toast.error('Could not load voices from ElevenLabs. Using mock voices for demo.');
      }
    } catch (error) {
      console.error('Error loading voices:', error);
      toast.error('Failed to load voices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoice(voice);
    updateProjectState({ selectedVoice: voice });
  };

  const generateVoiceover = async () => {
    if (!selectedVoice || !projectState.script) {
      toast.error('Please select a voice and ensure script is available');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiClient.generateVoiceover({
        script: projectState.script,
        voiceId: selectedVoice.id,
        speed: 1.0,
        stability: 0.5
      });

      if (response.success && response.data && typeof response.data === 'object' && 'audioUrl' in response.data && 'duration' in response.data) {
        updateProjectState({
          audioUrl: response.data.audioUrl as string,
          audioDuration: response.data.duration as number
        });
        toast.success('Voiceover generated successfully!');
        onNext();
      } else {
        throw new Error(response.error || 'Failed to generate voiceover');
      }
    } catch (error: unknown) {
      console.error('Voiceover generation error:', error);
              toast.error((error as Error).message || 'Failed to generate voiceover. Using mock data for demo.');
      
      // For demo purposes, simulate successful generation
      updateProjectState({
        audioUrl: '/demo-audio.mp3',
        audioDuration: 45
      });
      onNext();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (!selectedVoice) {
      toast.error('Please select a voice');
      return;
    }
    generateVoiceover();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading available voices...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your AI Voice
          </h2>
          <p className="text-gray-600">
            Select the perfect voice to bring your script to life. Preview each voice to find the best fit.
          </p>
        </div>

        {/* Voice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {voices.map((voice) => (
            <div
              key={voice.id}
              className={`
                p-6 border rounded-lg cursor-pointer transition-all duration-200
                ${selectedVoice?.id === voice.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
              `}
              onClick={() => handleVoiceSelect(voice)}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{voice.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {voice.gender} • {voice.accent}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {voice.previewUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle preview play/pause
                        if (playingVoice === voice.id) {
                          setPlayingVoice(null);
                        } else {
                          setPlayingVoice(voice.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      {playingVoice === voice.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <div className={`
                    w-4 h-4 rounded-full border-2
                    ${selectedVoice?.id === voice.id
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                    }
                  `}>
                    {selectedVoice?.id === voice.id && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {voice.description}
              </p>

              {/* Voice characteristics */}
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {voice.accent}
                </span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {voice.gender}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Voice Info */}
        {selectedVoice && (
          <div className="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <h4 className="font-semibold text-indigo-900 mb-2">
              Selected Voice: {selectedVoice.name}
            </h4>
            <p className="text-sm text-indigo-800">
              {selectedVoice.description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onPrev}
            className="flex items-center space-x-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedVoice || isGenerating}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Voiceover...</span>
              </>
            ) : (
              <>
                <span>Generate Voiceover</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}