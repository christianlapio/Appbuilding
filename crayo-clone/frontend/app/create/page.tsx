"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Video, ArrowLeft, ArrowRight } from 'lucide-react';
import { ProjectState, FormStep } from '@/types';
import ScriptStep from '@/components/steps/ScriptStep';
import VoiceoverStep from '@/components/steps/VoiceoverStep';
import BackgroundStep from '@/components/steps/BackgroundStep';
import CaptionsStep from '@/components/steps/CaptionsStep';
import ExportStep from '@/components/steps/ExportStep';
import StepIndicator from '@/components/StepIndicator';

const steps: FormStep[] = ['script', 'voiceover', 'background', 'captions', 'export'];
const stepTitles = {
  script: 'Create Your Script',
  voiceover: 'Choose Voice',
  background: 'Select Background',
  captions: 'Style Captions',
  export: 'Export Video'
};

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState<FormStep>('script');
  const [projectState, setProjectState] = useState<ProjectState>({
    tone: 'casual',
    musicVolume: 0.3,
    captionStyle: {
      fontFamily: 'Arial',
      fontSize: 48,
      fontColor: '#FFFFFF',
      backgroundColor: '#000000',
      animation: 'fade',
      position: 'center'
    }
  });

  const currentStepIndex = steps.indexOf(currentStep);
  const canGoNext = (() => {
    switch (currentStep) {
      case 'script':
        return !!projectState.scriptData;
      case 'voiceover':
        return !!projectState.voiceoverData;
      case 'background':
        return !!projectState.selectedBackground && !!projectState.selectedMusic;
      case 'captions':
        return true;
      case 'export':
        return false;
      default:
        return false;
    }
  })();

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1 && canGoNext) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const updateProjectState = (updates: Partial<ProjectState>) => {
    setProjectState(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Crayo Clone
            </span>
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Exit
          </Link>
        </nav>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {stepTitles[currentStep]}
          </h1>

          {/* Step Content */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            {currentStep === 'script' && (
              <ScriptStep
                projectState={projectState}
                updateProjectState={updateProjectState}
              />
            )}
            {currentStep === 'voiceover' && (
              <VoiceoverStep
                projectState={projectState}
                updateProjectState={updateProjectState}
              />
            )}
            {currentStep === 'background' && (
              <BackgroundStep
                projectState={projectState}
                updateProjectState={updateProjectState}
              />
            )}
            {currentStep === 'captions' && (
              <CaptionsStep
                projectState={projectState}
                updateProjectState={updateProjectState}
              />
            )}
            {currentStep === 'export' && (
              <ExportStep
                projectState={projectState}
                updateProjectState={updateProjectState}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>

            {currentStep !== 'export' && (
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}