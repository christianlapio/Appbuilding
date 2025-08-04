"use client";

import { useState } from 'react';
import { Sparkles, Link2, Loader2, Edit2 } from 'lucide-react';
import { ProjectState } from '@/types';
import { scriptAPI } from '@/lib/api';

interface ScriptStepProps {
  projectState: ProjectState;
  updateProjectState: (updates: Partial<ProjectState>) => void;
}

export default function ScriptStep({ projectState, updateProjectState }: ScriptStepProps) {
  const [inputType, setInputType] = useState<'prompt' | 'youtube'>('prompt');
  const [prompt, setPrompt] = useState(projectState.prompt || '');
  const [youtubeUrl, setYoutubeUrl] = useState(projectState.youtubeUrl || '');
  const [tone, setTone] = useState(projectState.tone);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [editingScript, setEditingScript] = useState(false);
  const [editedScript, setEditedScript] = useState('');

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);

    try {
      const response = await scriptAPI.generate({
        prompt: inputType === 'prompt' ? prompt : undefined,
        youtubeUrl: inputType === 'youtube' ? youtubeUrl : undefined,
        tone,
        maxWords: 150
      });

      if (response.success) {
        updateProjectState({
          prompt: inputType === 'prompt' ? prompt : undefined,
          youtubeUrl: inputType === 'youtube' ? youtubeUrl : undefined,
          tone,
          scriptData: response.data
        });
        setEditedScript(response.data.script);
      }
    } catch (err) {
      setError('Failed to generate script. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEdit = () => {
    if (projectState.scriptData && editedScript) {
      updateProjectState({
        scriptData: {
          ...projectState.scriptData,
          script: editedScript,
          wordCount: editedScript.split(/\s+/).length
        }
      });
      setEditingScript(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Type Selector */}
      <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg">
        <button
          onClick={() => setInputType('prompt')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            inputType === 'prompt'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>From Prompt</span>
        </button>
        <button
          onClick={() => setInputType('youtube')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            inputType === 'youtube'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Link2 className="h-4 w-4" />
          <span>From YouTube</span>
        </button>
      </div>

      {/* Input Field */}
      {inputType === 'prompt' ? (
        <div>
          <label className="block text-sm font-medium mb-2">
            What's your video about?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., How to stay focused while working from home"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
            rows={3}
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-2">
            YouTube Video URL
          </label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      )}

      {/* Tone Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Select Tone
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {(['casual', 'professional', 'funny', 'educational', 'motivational'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                tone === t
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      {!projectState.scriptData && (
        <button
          onClick={handleGenerate}
          disabled={isGenerating || (!prompt && !youtubeUrl)}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating Script...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Generate Script</span>
            </>
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Generated Script */}
      {projectState.scriptData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{projectState.scriptData.title}</h3>
            <button
              onClick={() => setEditingScript(!editingScript)}
              className="flex items-center space-x-1 text-purple-400 hover:text-purple-300"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit</span>
            </button>
          </div>

          {editingScript ? (
            <div className="space-y-4">
              <textarea
                value={editedScript}
                onChange={(e) => setEditedScript(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
                rows={8}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditingScript(false);
                    setEditedScript(projectState.scriptData?.script || '');
                  }}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="whitespace-pre-wrap">{projectState.scriptData.script}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{projectState.scriptData.wordCount} words</span>
            <span>~{projectState.scriptData.duration} seconds</span>
          </div>

          <button
            onClick={() => {
              updateProjectState({ scriptData: undefined });
              setEditedScript('');
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Generate New Script
          </button>
        </div>
      )}
    </div>
  );
}