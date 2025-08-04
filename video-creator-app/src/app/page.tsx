'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Download, Loader2 } from 'lucide-react';
import ScriptInput from '@/components/ScriptInput';
import VoiceSelection from '@/components/VoiceSelection';
import VideoCustomization from '@/components/VideoCustomization';
import VideoPreview from '@/components/VideoPreview';
import { VideoProject, GenerationStep } from '@/types';

const STEPS = [
  { id: 'script', title: 'Script Generation', description: 'Enter your topic or YouTube URL' },
  { id: 'voice', title: 'Voice Selection', description: 'Choose your AI voice' },
  { id: 'customize', title: 'Customize Video', description: 'Add backgrounds and music' },
  { id: 'preview', title: 'Preview & Export', description: 'Review and download your video' },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [project, setProject] = useState<Partial<VideoProject>>({});
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProject = (updates: Partial<VideoProject>) => {
    setProject(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ScriptInput
            project={project}
            onUpdate={updateProject}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <VoiceSelection
            project={project}
            onUpdate={updateProject}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <VideoCustomization
            project={project}
            onUpdate={updateProject}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <VideoPreview
            project={project}
            onPrevious={handlePrevious}
            generationSteps={generationSteps}
            setGenerationSteps={setGenerationSteps}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Video Creator AI</h1>
              <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                Beta
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                Help
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
