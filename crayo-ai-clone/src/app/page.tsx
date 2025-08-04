'use client';

import { useState } from 'react';
import { ProjectState, StepProgress } from '@/types';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import PromptStep from '@/components/steps/PromptStep';
import ScriptStep from '@/components/steps/ScriptStep';
import VoiceStep from '@/components/steps/VoiceStep';
import BackgroundStep from '@/components/steps/BackgroundStep';
import PreviewStep from '@/components/steps/PreviewStep';

const TOTAL_STEPS = 5;

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [projectState, setProjectState] = useState<ProjectState>({
    prompt: '',
    script: '',
    selectedVoice: null,
    selectedBackgroundVideo: null,
    selectedMusic: null,
    captions: [],
    audioUrl: '',
    audioDuration: 0,
  });

  const stepProgress: StepProgress = {
    currentStep,
    totalSteps: TOTAL_STEPS,
    completedSteps,
  };

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const handleNextStep = () => {
    handleStepComplete(currentStep);
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProjectState = (updates: Partial<ProjectState>) => {
    setProjectState(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PromptStep
            projectState={projectState}
            updateProjectState={updateProjectState}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <ScriptStep
            projectState={projectState}
            updateProjectState={updateProjectState}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 3:
        return (
          <VoiceStep
            projectState={projectState}
            updateProjectState={updateProjectState}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 4:
        return (
          <BackgroundStep
            projectState={projectState}
            updateProjectState={updateProjectState}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 5:
        return (
          <PreviewStep
            projectState={projectState}
            updateProjectState={updateProjectState}
            onPrev={handlePrevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <StepIndicator progress={stepProgress} />
          
          {/* Current Step Content */}
          <div className="mt-8">
            {renderCurrentStep()}
          </div>
        </div>
      </main>
    </div>
  );
}
