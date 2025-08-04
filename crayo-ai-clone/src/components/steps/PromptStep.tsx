'use client';

import { useState } from 'react';
import { ProjectState } from '@/types';
import { Lightbulb, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface PromptStepProps {
  projectState: ProjectState;
  updateProjectState: (updates: Partial<ProjectState>) => void;
  onNext: () => void;
}

const examplePrompts = [
  "How to stay focused while working from home",
  "5 morning habits that changed my life",
  "Quick healthy breakfast ideas for busy people",
  "Why you should start investing in your 20s",
  "Simple productivity tips that actually work",
  "The science behind better sleep habits"
];

export default function PromptStep({ projectState, updateProjectState, onNext }: PromptStepProps) {
  const [prompt, setPrompt] = useState(projectState.prompt);
  

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    updateProjectState({ prompt: value });
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    updateProjectState({ prompt: example });
  };

  const handleNext = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for your video');
      return;
    }

    if (prompt.length < 10) {
      toast.error('Please provide a more detailed prompt (at least 10 characters)');
      return;
    }

    onNext();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            What&apos;s your video about?
          </h2>
          <p className="text-gray-600">
            Describe the topic or message you want to share. Our AI will create an engaging script for your short-form video.
          </p>
        </div>

        {/* Prompt Input */}
        <div className="mb-8">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-3">
            Video Topic or Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            placeholder="e.g., How to build confidence in public speaking, or share your best productivity tips..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              Be specific and engaging. Think about what would grab attention in the first few seconds.
            </p>
            <span className="text-sm text-gray-400">
              {prompt.length}/500
            </span>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 Need inspiration? Try these examples:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
              >
                <p className="text-sm text-gray-700 group-hover:text-indigo-700">
                  {example}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!prompt.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            <>
              <span>Generate Script</span>
              <ArrowRight className="w-5 h-5" />
            </>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Focus on topics that solve problems or provide value</li>
            <li>• Use action words and emotional triggers</li>
            <li>• Keep your target audience in mind</li>
            <li>• Think about trending topics in your niche</li>
          </ul>
        </div>
      </div>
    </div>
  );
}