/**
 * Values Discovery Form Component
 * Main wizard container for the values discovery section (Enhanced)
 * Steps: Intro → Sort → Unsure Resolution → Top 10 → Top 5 → Tradeoffs → Non-Negotiables → Summary
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { ValuesDiscovery, Pile, TradeoffResponse, UnsureResolution } from '@/types/valuesDiscovery';
import { ValuesSortStep } from './values/ValuesSortStep';
import { UnsureResolutionStep } from './values/UnsureResolutionStep';
import { TopNSelectionStep } from './values/TopNSelectionStep';
import { TradeoffValidationStep } from './values/TradeoffValidationStep';
import { NonNegotiablesStep } from './values/NonNegotiablesStep';
import { ValuesSummary } from './values/ValuesSummary';
import { getImportantCardIds, computeDerivedInsights } from '@/services/valuesLogic';
import { Button } from '@/components/common';

type WizardStep = 'intro' | 'sort' | 'unsureResolution' | 'top10' | 'top5' | 'tradeoffs' | 'nonNegotiables' | 'summary';

interface ValuesDiscoveryFormProps {
  initialData?: Partial<ValuesDiscovery>;
  onSave: (data: ValuesDiscovery) => void;
  onAutoSave?: (data: Partial<ValuesDiscovery>) => void;
  isAdvisorMode?: boolean;
  clientName?: string;
}

export function ValuesDiscoveryForm({
  initialData,
  onSave,
  onAutoSave,
  isAdvisorMode = false,
}: ValuesDiscoveryFormProps): JSX.Element {
  // Determine initial step based on existing data
  const getInitialStep = (): WizardStep => {
    if (!initialData) return 'intro';
    if (initialData.completedAt) return 'summary';
    if (initialData.step6CompletedAt) return 'summary';
    if (initialData.step5CompletedAt) return 'nonNegotiables';
    if (initialData.step4CompletedAt) return 'tradeoffs';
    if (initialData.top5?.length === 5) return 'top5';
    if (initialData.top10?.length === 10 || initialData.top10?.length === Math.min(10, Object.values(initialData.piles || {}).filter(p => p === 'IMPORTANT').length)) return 'top5';
    if (initialData.step2CompletedAt) return 'top10';
    if (initialData.step1CompletedAt) return 'unsureResolution';
    if (initialData.piles && Object.keys(initialData.piles).length > 0) return 'sort';
    return 'intro';
  };

  const [currentStep, setCurrentStep] = useState<WizardStep>(getInitialStep);

  // Form state
  const [formData, setFormData] = useState<Partial<ValuesDiscovery>>(() => ({
    state: 'NOT_STARTED',
    piles: {},
    unsureResolutions: [],
    top10: [],
    top5: [],
    tradeoffResponses: [],
    nonNegotiables: [],
    ...initialData,
  }));

  // Auto-save debounce
  const autoSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Auto-save effect
  useEffect(() => {
    if (onAutoSave && formData.state !== 'NOT_STARTED') {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
      autoSaveTimeout.current = setTimeout(() => {
        onAutoSave(formData);
      }, 500);
    }
    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [formData, onAutoSave]);

  // Update state to in_progress when user starts
  const handleStart = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      state: 'IN_PROGRESS',
    }));
    setCurrentStep('sort');
  }, []);

  // Handle pile changes during sorting
  const handlePileChange = useCallback((cardId: string, pile: Pile) => {
    setFormData((prev) => ({
      ...prev,
      piles: {
        ...prev.piles,
        [cardId]: pile,
      },
    }));
  }, []);

  // Complete step 1 (sorting) - move to unsure resolution
  const handleSortComplete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      step1CompletedAt: new Date().toISOString(),
    }));
    setCurrentStep('unsureResolution');
  }, []);

  // Handle unsure resolution - update pile when user resolves an unsure card
  const handleUnsureResolution = useCallback((cardId: string, newPile: 'IMPORTANT' | 'NOT_IMPORTANT' | 'UNSURE') => {
    setFormData((prev) => {
      // Update the pile
      const updatedPiles = { ...prev.piles, [cardId]: newPile };

      // Record the resolution
      const resolution: UnsureResolution = {
        cardId,
        from: 'UNSURE',
        to: newPile,
        answeredAt: new Date().toISOString(),
      };

      // Add to resolutions (or update if already exists)
      const existingIndex = (prev.unsureResolutions || []).findIndex((r) => r.cardId === cardId);
      const updatedResolutions = [...(prev.unsureResolutions || [])];
      if (existingIndex >= 0) {
        updatedResolutions[existingIndex] = resolution;
      } else {
        updatedResolutions.push(resolution);
      }

      return {
        ...prev,
        piles: updatedPiles,
        unsureResolutions: updatedResolutions,
      };
    });
  }, []);

  // Complete step 2 (unsure resolution) - move to top 10 selection
  const handleUnsureResolutionComplete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      step2CompletedAt: new Date().toISOString(),
    }));
    setCurrentStep('top10');
  }, []);

  // Handle top 10 selection changes
  const handleTop10Change = useCallback((selectedIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      top10: selectedIds,
    }));
  }, []);

  // Complete top 10 selection - move to top 5
  const handleTop10Complete = useCallback(() => {
    setCurrentStep('top5');
  }, []);

  // Handle top 5 selection changes
  const handleTop5Change = useCallback((selectedIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      top5: selectedIds,
    }));
  }, []);

  // Complete top 5 selection - move to tradeoffs
  const handleTop5Complete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      step4CompletedAt: new Date().toISOString(),
    }));
    setCurrentStep('tradeoffs');
  }, []);

  // Handle tradeoff responses
  const handleTradeoffResponsesChange = useCallback((responses: TradeoffResponse[]) => {
    setFormData((prev) => ({
      ...prev,
      tradeoffResponses: responses,
    }));
  }, []);

  // Complete tradeoffs - move to non-negotiables
  const handleTradeoffsComplete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      step5CompletedAt: new Date().toISOString(),
    }));
    setCurrentStep('nonNegotiables');
  }, []);

  // Handle non-negotiables selection
  const handleNonNegotiablesChange = useCallback((nonNegotiables: string[]) => {
    setFormData((prev) => ({
      ...prev,
      nonNegotiables,
    }));
  }, []);

  // Complete non-negotiables - compute derived and move to summary
  const handleNonNegotiablesComplete = useCallback(() => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        step6CompletedAt: new Date().toISOString(),
      };
      // Compute derived insights
      updated.derived = computeDerivedInsights(updated as ValuesDiscovery);
      return updated;
    });
    setCurrentStep('summary');
  }, []);

  // Final completion - save and continue
  const handleComplete = useCallback(() => {
    const completedData: ValuesDiscovery = {
      state: 'COMPLETED',
      piles: formData.piles || {},
      unsureResolutions: formData.unsureResolutions || [],
      top10: formData.top10 || [],
      top5: formData.top5 || [],
      tradeoffResponses: formData.tradeoffResponses || [],
      nonNegotiables: formData.nonNegotiables || [],
      step1CompletedAt: formData.step1CompletedAt,
      step2CompletedAt: formData.step2CompletedAt,
      step4CompletedAt: formData.step4CompletedAt,
      step5CompletedAt: formData.step5CompletedAt,
      step6CompletedAt: formData.step6CompletedAt,
      derived: formData.derived,
      completedAt: new Date().toISOString(),
    };
    onSave(completedData);
  }, [formData, onSave]);

  // Navigation helpers
  const goToSort = useCallback(() => setCurrentStep('sort'), []);
  const goToUnsureResolution = useCallback(() => setCurrentStep('unsureResolution'), []);
  const goToTop10 = useCallback(() => setCurrentStep('top10'), []);
  const goToTop5 = useCallback(() => setCurrentStep('top5'), []);
  const goToTradeoffs = useCallback(() => setCurrentStep('tradeoffs'), []);
  const goToNonNegotiables = useCallback(() => setCurrentStep('nonNegotiables'), []);

  // Get important card IDs for top 10 selection
  const importantCardIds = getImportantCardIds(formData.piles || {});

  // Render current step
  const renderStep = (): JSX.Element => {
    switch (currentStep) {
      case 'intro':
        return (
          <IntroStep
            onStart={handleStart}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'sort':
        return (
          <ValuesSortStep
            piles={formData.piles || {}}
            onPileChange={handlePileChange}
            onComplete={handleSortComplete}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'unsureResolution':
        return (
          <UnsureResolutionStep
            piles={formData.piles || {}}
            unsureResolutions={formData.unsureResolutions || []}
            onResolution={handleUnsureResolution}
            onComplete={handleUnsureResolutionComplete}
            onBack={goToSort}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'top10':
        return (
          <TopNSelectionStep
            availableCardIds={importantCardIds}
            selectedCardIds={formData.top10 || []}
            targetCount={Math.min(10, importantCardIds.length)}
            onSelectionChange={handleTop10Change}
            onComplete={handleTop10Complete}
            onBack={goToUnsureResolution}
            title="Select Your Top 10"
            prompt={
              isAdvisorMode
                ? "From the client's important values, select the 10 that matter most when tradeoffs come up."
                : 'From your important values, select the 10 that matter most when tradeoffs come up.'
            }
            continueLabel="Continue to Top 5"
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'top5':
        return (
          <TopNSelectionStep
            availableCardIds={formData.top10 || []}
            selectedCardIds={formData.top5 || []}
            targetCount={5}
            onSelectionChange={handleTop5Change}
            onComplete={handleTop5Complete}
            onBack={goToTop10}
            title="Select Your Top 5"
            prompt={
              isAdvisorMode
                ? "If the client could only protect five values for the rest of their life, which five would they choose?"
                : 'If you could only protect five values for the rest of your life, which five would you choose?'
            }
            continueLabel="Continue to Tradeoffs"
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'tradeoffs':
        return (
          <TradeoffValidationStep
            top5={formData.top5 || []}
            existingResponses={formData.tradeoffResponses || []}
            onResponsesChange={handleTradeoffResponsesChange}
            onComplete={handleTradeoffsComplete}
            onBack={goToTop5}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'nonNegotiables':
        return (
          <NonNegotiablesStep
            top5={formData.top5 || []}
            selectedNonNegotiables={formData.nonNegotiables || []}
            onSelectionChange={handleNonNegotiablesChange}
            onComplete={handleNonNegotiablesComplete}
            onBack={goToTradeoffs}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'summary':
        return (
          <ValuesSummary
            data={formData as ValuesDiscovery}
            onComplete={handleComplete}
            onBack={goToNonNegotiables}
            isAdvisorMode={isAdvisorMode}
          />
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  // Progress indicator
  const steps: { key: WizardStep; label: string }[] = [
    { key: 'intro', label: 'Start' },
    { key: 'sort', label: 'Sort' },
    { key: 'unsureResolution', label: 'Review' },
    { key: 'top10', label: 'Top 10' },
    { key: 'top5', label: 'Top 5' },
    { key: 'tradeoffs', label: 'Tradeoffs' },
    { key: 'nonNegotiables', label: 'Core' },
    { key: 'summary', label: 'Summary' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="space-y-6">
      {/* Step progress indicator - compact and responsive */}
      {currentStep !== 'intro' && (
        <div className="space-y-3">
          {/* Step counter and label */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {steps.find((s) => s.key === currentStep)?.label}
            </span>
            <span className="text-sm text-gray-500">
              Step {currentStepIndex} of {steps.length - 1}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStepIndex) / (steps.length - 1)) * 100}%` }}
            />
          </div>
          {/* Step dots - mobile friendly */}
          <div className="flex justify-between">
            {steps.slice(1).map((step, index) => {
              const isActive = step.key === currentStep;
              const isComplete = currentStepIndex > index + 1;

              return (
                <div
                  key={step.key}
                  className={`
                    w-2.5 h-2.5 rounded-full transition-colors
                    ${isComplete ? 'bg-green-500' : isActive ? 'bg-primary' : 'bg-gray-300'}
                  `}
                  title={step.label}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Step content */}
      {renderStep()}
    </div>
  );
}

/** Intro step component */
interface IntroStepProps {
  onStart: () => void;
  isAdvisorMode: boolean;
}

function IntroStep({ onStart, isAdvisorMode }: IntroStepProps): JSX.Element {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {isAdvisorMode ? 'Values Discovery' : 'Discover Your Core Values'}
        </h2>
        <p className="text-lg text-gray-600">
          {isAdvisorMode
            ? "This exercise helps identify what the client's financial plan should protect and prioritize."
            : 'This exercise helps identify what your financial plan should protect and prioritize when tradeoffs come up.'}
        </p>
      </div>

      {/* What to expect */}
      <div className="bg-gray-50 rounded-xl p-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">What to expect:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              1
            </span>
            <span className="text-gray-600">
              <strong>Sort values</strong> - Review value cards and sort them by importance
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              2
            </span>
            <span className="text-gray-600">
              <strong>Narrow down</strong> - From your important values, pick the top 10, then top 5
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              3
            </span>
            <span className="text-gray-600">
              <strong>Tradeoff questions</strong> - Answer a few questions to validate your priorities
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              4
            </span>
            <span className="text-gray-600">
              <strong>Non-negotiables</strong> - Identify the values you won't compromise on
            </span>
          </li>
        </ul>
      </div>

      {/* Time estimate */}
      <p className="text-sm text-gray-500">
        Estimated time: 8-10 minutes
      </p>

      {/* Start button */}
      <Button onClick={onStart} className="px-8">
        Start Values Discovery
      </Button>
    </div>
  );
}
