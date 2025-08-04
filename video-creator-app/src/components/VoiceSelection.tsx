'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Loader2 } from 'lucide-react';
import { VideoProject, Voice } from '@/types';

interface VoiceSelectionProps {
  project: Partial<VideoProject>;
  onUpdate: (updates: Partial<VideoProject>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function VoiceSelection({ project, onUpdate, onNext, onPrevious }: VoiceSelectionProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(project.voiceId || '');
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const response = await fetch('/api/generate-voiceover');
      if (response.ok) {
        const data = await response.json();
        setVoices(data.availableVoices);
        if (!selectedVoice && data.availableVoices.length > 0) {
          setSelectedVoice(data.availableVoices[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
    onUpdate({ voiceId });
  };

  const generatePreview = async () => {
    if (!project.script || !selectedVoice) return;

    setIsGeneratingPreview(true);
    try {
      const response = await fetch('/api/generate-voiceover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: project.script.substring(0, 100) + '...', // Preview with first 100 chars
          voiceId: selectedVoice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const data = await response.json();
      setPreviewAudio(data.audio);
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Failed to generate preview. Please try again.');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const playPreview = () => {
    if (previewAudio) {
      const audio = new Audio(`data:audio/mp3;base64,${previewAudio}`);
      audio.play();
      setIsPlayingPreview(true);
      audio.onended = () => setIsPlayingPreview(false);
    }
  };

  const handleNext = () => {
    if (selectedVoice) {
      onNext();
    }
  };

  if (isLoadingVoices) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading available voices...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your AI Voice
        </h2>
        <p className="text-lg text-gray-600">
          Select a voice that matches your content and brand
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Voice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {voices.map((voice) => (
            <motion.div
              key={voice.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedVoice === voice.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleVoiceSelect(voice.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{voice.name}</h3>
                <Volume2 className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-sm text-gray-600">{voice.description}</p>
              {selectedVoice === voice.id && (
                <div className="mt-2 text-purple-600 text-sm font-medium">
                  ✓ Selected
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Preview Section */}
        {selectedVoice && project.script && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Voice Preview</h3>
              <button
                onClick={generatePreview}
                disabled={isGeneratingPreview}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {isGeneratingPreview ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Preview
                  </>
                )}
              </button>
            </div>

            {previewAudio && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={playPreview}
                    disabled={isPlayingPreview}
                    className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {isPlayingPreview ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Preview Audio</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
            disabled={!selectedVoice}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continue to Customization
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">🎤 Voice Selection Tips</h3>
        <ul className="text-blue-800 space-y-2">
          <li>• Choose a voice that matches your target audience</li>
          <li>• Consider the tone of your content (professional, casual, energetic)</li>
          <li>• Test the preview to ensure the voice fits your script</li>
          <li>• Different voices work better for different types of content</li>
        </ul>
      </div>
    </div>
  );
}