'use client';

import { StepProgress } from '@/types';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  progress: StepProgress;
}

const steps = [
  { id: 1, title: 'Prompt', description: 'Describe your video' },
  { id: 2, title: 'Script', description: 'Review & edit script' },
  { id: 3, title: 'Voice', description: 'Choose AI voice' },
  { id: 4, title: 'Background', description: 'Select visuals & music' },
  { id: 5, title: 'Preview', description: 'Generate & download' },
];

export default function StepIndicator({ progress }: StepIndicatorProps) {
  const { currentStep, completedSteps } = progress;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                
                {/* Step Info */}
                <div className="mt-3 text-center">
                  <p
                    className={`
                      text-sm font-medium
                      ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                    `}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 mt-[-2rem] transition-all duration-300
                    ${step.id < currentStep || completedSteps.includes(step.id) 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}