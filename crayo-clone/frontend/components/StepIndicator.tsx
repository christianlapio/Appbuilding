import { Check } from 'lucide-react';
import { FormStep } from '@/types';

interface StepIndicatorProps {
  steps: FormStep[];
  currentStep: FormStep;
}

const stepIcons = {
  script: '1',
  voiceover: '2',
  background: '3',
  captions: '4',
  export: '5'
};

const stepLabels = {
  script: 'Script',
  voiceover: 'Voice',
  background: 'Background',
  captions: 'Captions',
  export: 'Export'
};

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-colors
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : isCurrent
                    ? 'bg-purple-600/20 border-2 border-purple-600 text-purple-400'
                    : 'bg-gray-800 text-gray-500 border-2 border-gray-700'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  stepIcons[step]
                )}
              </div>
              <span className={`
                text-sm mt-2 font-medium
                ${isCurrent ? 'text-purple-400' : 'text-gray-500'}
              `}>
                {stepLabels[step]}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  w-20 h-0.5 mb-6 transition-colors
                  ${isCompleted ? 'bg-purple-600' : 'bg-gray-700'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}