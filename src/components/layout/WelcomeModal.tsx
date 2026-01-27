/**
 * WelcomeModal Component
 * First-time user onboarding experience
 *
 * SEC-27: Hooks extracted to src/hooks/useWelcome.ts to fix React Refresh warnings.
 * React Fast Refresh requires component files to only export components.
 */

import { useState } from 'react';
import { Modal, ModalFooter } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useWelcomeModal } from '@/hooks/useWelcome';

interface WelcomeModalProps {
  onComplete: () => void;
}

export function WelcomeModal({ onComplete }: WelcomeModalProps): JSX.Element {
  const { isOpen, markAsSeen } = useWelcomeModal();
  const [step, setStep] = useState(0);

  const handleComplete = (): void => {
    markAsSeen();
    onComplete();
  };

  const handleSkip = (): void => {
    markAsSeen();
  };

  const steps = [
    {
      title: 'Welcome to Pathfinder',
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <p className="text-gray-600">
            Your personal guide to financial decision-making. Let's build your Financial Decision Profile to understand your unique situation and goals.
          </p>
        </div>
      ),
    },
    {
      title: 'How It Works',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
              1
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Answer Questions</h4>
              <p className="text-sm text-gray-600">We'll ask about your situation, goals, and preferences across 5 short sections.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
              2
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Build Your Profile</h4>
              <p className="text-sm text-gray-600">Your answers create a comprehensive Financial Decision Profile.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
              3
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Get Insights</h4>
              <p className="text-sm text-gray-600">See your planning stage, strategy indicators, and upcoming decision windows.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Your Data is Safe',
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">
            Your information is stored locally on your device. We don't collect or share your personal data.
          </p>
          <p className="text-sm text-gray-500">
            You can save your progress and return anytime. Export your profile as JSON whenever you need it.
          </p>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip}
      title={currentStep.title}
      size="md"
    >
      <div className="min-h-[200px]">
        {currentStep.content}
      </div>

      {/* Step indicators */}
      <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Welcome steps">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setStep(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === step ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            aria-label={`Go to step ${index + 1}`}
            aria-selected={index === step}
            role="tab"
          />
        ))}
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={handleSkip}>
          Skip
        </Button>
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {isLastStep ? (
          <Button onClick={handleComplete}>
            Get Started
          </Button>
        ) : (
          <Button onClick={() => setStep(step + 1)}>
            Next
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
