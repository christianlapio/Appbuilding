'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Youtube, Loader2, Edit3 } from 'lucide-react';
import { VideoProject, ScriptGenerationRequest } from '@/types';

interface ScriptInputProps {
  project: Partial<VideoProject>;
  onUpdate: (updates: Partial<VideoProject>) => void;
  onNext: () => void;
}

export default function ScriptInput({ project, onUpdate, onNext }: ScriptInputProps) {
  const [prompt, setPrompt] = useState(project.script || '');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMode, setInputMode] = useState<'prompt' | 'youtube'>('prompt');

  const handleGenerateScript = async () => {
    if (!prompt && !youtubeUrl) return;

    setIsGenerating(true);
    try {
      const request: ScriptGenerationRequest = {};
      
      if (inputMode === 'prompt') {
        request.prompt = prompt;
      } else {
        request.youtubeUrl = youtubeUrl;
      }

      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const data = await response.json();
      onUpdate({ script: data.script });
    } catch (error) {
      console.error('Error generating script:', error);
      alert('Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (project.script) {
      onNext();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Create Your Video Script
        </h2>
        <p className="text-lg text-gray-600">
          Enter a topic or paste a YouTube URL to generate an engaging script
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Input Mode Toggle */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setInputMode('prompt')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'prompt'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Topic
          </button>
          <button
            onClick={() => setInputMode('youtube')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'youtube'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Youtube className="w-4 h-4 inline mr-2" />
            YouTube URL
          </button>
        </div>

        {/* Input Fields */}
        {inputMode === 'prompt' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to create a video about?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., How to stay focused, 5 productivity tips, The benefits of meditation..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={handleGenerateScript}
            disabled={isGenerating || (!prompt && !youtubeUrl)}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Script
              </>
            )}
          </button>
        </div>

        {/* Generated Script */}
        {project.script && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Script</h3>
              <button
                onClick={() => onUpdate({ script: '' })}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Regenerate
              </button>
            </div>
            <div className="bg-white p-4 rounded border">
              <p className="text-gray-800 whitespace-pre-wrap">{project.script}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Continue to Voice Selection
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Better Scripts</h3>
        <ul className="text-blue-800 space-y-2">
          <li>• Be specific about your topic for more targeted content</li>
          <li>• Include action words to make your video more engaging</li>
          <li>• Keep it under 60 seconds for optimal social media performance</li>
          <li>• Use YouTube URLs from educational or informative videos</li>
        </ul>
      </div>
    </div>
  );
}