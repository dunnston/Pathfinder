/**
 * Purpose Drivers Step Component (Step 2)
 * Select what money protects or enables (1-2 drivers)
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/common';
import type { PurposeDriver } from '@/types/financialPurpose';
import { PURPOSE_DRIVER_OPTIONS } from '@/data/purposeTemplates';

interface PurposeDriversStepProps {
  primaryDriver?: PurposeDriver;
  secondaryDriver?: PurposeDriver;
  onDriversChange: (primary: PurposeDriver, secondary?: PurposeDriver) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode: boolean;
}

export function PurposeDriversStep({
  primaryDriver,
  secondaryDriver,
  onDriversChange,
  onComplete,
  onBack,
  isAdvisorMode,
}: PurposeDriversStepProps): JSX.Element {
  const [selected, setSelected] = useState<PurposeDriver[]>(() => {
    const initial: PurposeDriver[] = [];
    if (primaryDriver) initial.push(primaryDriver);
    if (secondaryDriver) initial.push(secondaryDriver);
    return initial;
  });

  // Update parent when selection changes
  useEffect(() => {
    if (selected.length > 0) {
      onDriversChange(selected[0], selected[1]);
    }
  }, [selected, onDriversChange]);

  const handleToggle = (driverId: PurposeDriver): void => {
    setSelected((prev) => {
      if (prev.includes(driverId)) {
        // Remove it
        return prev.filter((id) => id !== driverId);
      } else if (prev.length < 2) {
        // Add it
        return [...prev, driverId];
      } else {
        // Replace the second one
        return [prev[0], driverId];
      }
    });
  };

  const canContinue = selected.length >= 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          What does money protect or enable?
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "When money is working well for the client, what is it mainly doing? Select 1-2 drivers."
            : 'When money is working well, what is it mainly doing for you? Select 1-2 drivers.'}
        </p>
      </div>

      {/* Selection count */}
      <div className="flex items-center justify-center gap-2">
        <span className={`text-sm ${selected.length >= 1 ? 'text-green-600' : 'text-gray-500'}`}>
          {selected.length}/2 selected
        </span>
        {selected.length === 2 && (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Driver cards */}
      <div className="grid gap-3">
        {PURPOSE_DRIVER_OPTIONS.map((driver, index) => {
          const isSelected = selected.includes(driver.id);
          const isPrimary = selected[0] === driver.id;
          const isSecondary = selected[1] === driver.id;

          return (
            <button
              key={driver.id}
              onClick={() => handleToggle(driver.id)}
              className={`
                relative text-left p-4 rounded-xl border-2 transition-all
                ${isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Selection indicator */}
                <div
                  className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isSelected
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-400'
                    }
                  `}
                >
                  {isPrimary ? '1' : isSecondary ? '2' : index + 1}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`font-medium ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                    {driver.label}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {driver.description}
                  </p>
                </div>

                {/* Check indicator */}
                {isSelected && (
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected preview */}
      {selected.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-2">Your selection:</p>
          <div className="space-y-2">
            {selected.map((driverId, index) => {
              const driver = PURPOSE_DRIVER_OPTIONS.find((d) => d.id === driverId);
              return (
                <div key={driverId} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {index === 0 ? 'Primary' : 'Secondary'}
                  </span>
                  <span className="text-sm text-gray-700">{driver?.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete} disabled={!canContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
