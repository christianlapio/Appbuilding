'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProjectState } from '@/types';
import { FileText, ArrowRight, ArrowLeft, Loader2, RefreshCw, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';

interface ScriptStepProps {
  projectState: ProjectState;
  updateProjectState: (updates: Partial<ProjectState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ScriptStep({ projectState, updateProjectState, onNext, onPrev }: ScriptStepProps) {
  const [script, setScript] = useState(projectState.script);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'casual' | 'professional' | 'energetic' | 'calm'>('energetic');
  const [targetDuration, setTargetDuration] = useState(60);

  const generateScript = useCallback(async () => {
    if (!projectState.prompt) {
      toast.error('No prompt available to generate script');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiClient.generateScript({
        prompt: projectState.prompt,
        duration: targetDuration,
        tone: selectedTone
      });

      if (response.success && response.data && typeof response.data === 'object' && 'script' in response.data) {
        const generatedScript = response.data.script as string;
        setScript(generatedScript);
        updateProjectState({ script: generatedScript });
        toast.success('Script generated successfully!');
      } else {
        throw new Error(response.error || 'Failed to generate script');
      }
    } catch (error: unknown) {
      console.error('Script generation error:', error);
              toast.error((error as Error).message || 'Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [projectState.prompt, selectedTone, targetDuration, updateProjectState]);

  useEffect(() => {
    // If we don't have a script and we have a prompt, generate one automatically
    if (!script && projectState.prompt && !isGenerating) {
      generateScript();
    }
  }, [projectState.prompt, script, isGenerating, generateScript]);

  const handleScriptChange = (value: string) => {
    setScript(value);
    updateProjectState({ script: value });
  };

  const handleNext = () => {
    if (!script.trim()) {
      toast.error('Please generate or enter a script');
      return;
    }

    if (script.length < 50) {
      toast.error('Script is too short. Please add more content.');
      return;
    }

    onNext();
  };

  const wordCount = script.split(' ').filter(word => word.length > 0).length;
  const estimatedDuration = Math.round(wordCount / 2.5); // ~150 words per minute / 60 seconds

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Review Your Script
          </h2>
          <p className="text-gray-600">
            AI-generated script based on your prompt. Feel free to edit and customize it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Script Editor */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Script Content</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? 'Preview' : 'Edit'}</span>
                </button>
                <button
                  onClick={generateScript}
                  disabled={isGenerating}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-300 rounded-md hover:bg-indigo-50 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {isGenerating ? (
              <div className="h-96 border border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                  <p className="text-gray-600">Generating your script...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take 10-20 seconds</p>
                </div>
              </div>
            ) : (
              <>
                {isEditing ? (
                  <textarea
                    value={script}
                    onChange={(e) => handleScriptChange(e.target.value)}
                    className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
                    placeholder="Your script will appear here..."
                  />
                ) : (
                  <div className="h-96 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
                    {script ? (
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {script}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">
                        Your script will appear here...
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Script Stats */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>{wordCount} words</span>
                <span>~{estimatedDuration}s duration</span>
                <span>{script.length} characters</span>
              </div>
              <div className="flex items-center space-x-2">
                {estimatedDuration > 90 && (
                  <span className="text-orange-600 text-xs">⚠️ May be too long for short-form</span>
                )}
                {estimatedDuration < 15 && script && (
                  <span className="text-orange-600 text-xs">⚠️ May be too short</span>
                )}
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Settings</h3>
              
              {/* Tone Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value as 'casual' | 'professional' | 'energetic' | 'calm')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="energetic">Energetic</option>
                  <option value="casual">Casual</option>
                  <option value="professional">Professional</option>
                  <option value="calm">Calm</option>
                </select>
              </div>

              {/* Duration Target */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Duration
                </label>
                <select
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={30}>30 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={90}>90 seconds</option>
                </select>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">✨ Script Tips:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Start with a hook in the first 3 seconds</li>
                <li>• Use simple, conversational language</li>
                <li>• Include a clear call-to-action</li>
                <li>• Keep sentences short and punchy</li>
              </ul>
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
            disabled={!script.trim() || isGenerating}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            <span>Choose Voice</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}