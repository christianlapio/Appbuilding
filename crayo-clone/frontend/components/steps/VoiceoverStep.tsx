"use client";

import { useState, useEffect } from 'react';
import { Mic, Play, Pause, Loader2, Check } from 'lucide-react';
import { ProjectState, Voice } from '@/types';
import { voiceoverAPI } from '@/lib/api';

interface VoiceoverStepProps {
  projectState: ProjectState;
  updateProjectState: (updates: Partial<ProjectState>) => void;
}

export default function VoiceoverStep({ projectState, updateProjectState }: VoiceoverStepProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(projectState.selectedVoice || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchVoices();
  }, []);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  const fetchVoices = async () => {
    try {
      const response = await voiceoverAPI.getVoices();
      if (response.success) {
        setVoices(response.data);
      }
    } catch (err) {
      setError('Failed to load voices');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoice(voice);
  };

  const handlePreview = async (voice: Voice) => {
    if (playingPreview === voice.id) {
      // Stop playing
      if (audioElement) {
        audioElement.pause();
        setPlayingPreview(null);
      }
      return;
    }

    try {
      setPlayingPreview(voice.id);
      const response = await voiceoverAPI.preview(voice.id);
      
      if (response.success && response.data.audioUrl) {
        const audio = new Audio(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${response.data.audioUrl}`);
        setAudioElement(audio);
        
        audio.addEventListener('ended', () => {
          setPlayingPreview(null);
        });
        
        await audio.play();
      }
    } catch (err) {
      setError('Failed to preview voice');
      setPlayingPreview(null);
      console.error(err);
    }
  };

  const handleGenerateVoiceover = async () => {
    if (!selectedVoice || !projectState.scriptData) return;

    setError('');
    setIsGenerating(true);

    try {
      const response = await voiceoverAPI.generate({
        text: projectState.scriptData.script,
        voiceId: selectedVoice.id,
        speed: 1.0,
        pitch: 0
      });

      if (response.success) {
        updateProjectState({
          selectedVoice,
          voiceoverData: response.data
        });
      }
    } catch (err) {
      setError('Failed to generate voiceover. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const playGeneratedVoiceover = () => {
    if (projectState.voiceoverData) {
      const audio = new Audio(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${projectState.voiceoverData.audioUrl}`);
      audio.play();
    }
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
      {!projectState.voiceoverData ? (
        <>
          {/* Voice Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {voices.map((voice) => (
              <div
                key={voice.id}
                onClick={() => handleVoiceSelect(voice)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedVoice?.id === voice.id
                    ? 'border-purple-600 bg-purple-600/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg flex items-center space-x-2">
                      <span>{voice.name}</span>
                      {selectedVoice?.id === voice.id && (
                        <Check className="h-5 w-5 text-purple-400" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {voice.gender === 'male' ? '👨' : '👩'} {voice.accent} accent
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{voice.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(voice);
                    }}
                    className="ml-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    {playingPreview === voice.id ? (
                      <Pause className="h-5 w-5 text-purple-400" />
                    ) : (
                      <Play className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateVoiceover}
            disabled={!selectedVoice || isGenerating}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating Voiceover...</span>
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                <span>Generate Voiceover</span>
              </>
            )}
          </button>
        </>
      ) : (
        /* Generated Voiceover */
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Voiceover Generated!</h3>
                <p className="text-gray-400">
                  Voice: {projectState.selectedVoice?.name} • Duration: {projectState.voiceoverData.duration}s
                </p>
              </div>
              <button
                onClick={playGeneratedVoiceover}
                className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
              >
                <Play className="h-6 w-6" />
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Mic className="h-5 w-5 text-purple-400" />
                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-full w-full" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              updateProjectState({ voiceoverData: undefined, selectedVoice: undefined });
              setSelectedVoice(null);
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Generate with Different Voice
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}