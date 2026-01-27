/**
 * Financial Purpose Form Component
 * Main wizard container for the Statement of Financial Purpose section (MVP)
 * Steps: Intro -> Confirm Inputs -> Purpose Drivers -> Tradeoff Anchors -> Vision Anchors -> Draft Assembly -> Refinement -> Summary
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { FinancialPurpose, TradeoffAnchor, SoFPDraft, PurposeDriver } from '@/types/financialPurpose';
import type { ValuesDiscovery } from '@/types/valuesDiscovery';
import type { FinancialGoals } from '@/types/financialGoals';
import { PurposeIntro } from './purpose/PurposeIntro';
import { ConfirmInputsStep } from './purpose/ConfirmInputsStep';
import { PurposeDriversStep } from './purpose/PurposeDriversStep';
import { TradeoffAnchorStep } from './purpose/TradeoffAnchorStep';
import { VisionAnchorStep } from './purpose/VisionAnchorStep';
import { DraftAssemblyStep } from './purpose/DraftAssemblyStep';
import { RefinementStep } from './purpose/RefinementStep';
import { PurposeSummary } from './purpose/PurposeSummary';

type WizardStep = 'intro' | 'confirmInputs' | 'drivers' | 'tradeoffs' | 'visionAnchors' | 'drafts' | 'refinement' | 'summary';

interface FinancialPurposeFormProps {
  initialData?: Partial<FinancialPurpose>;
  valuesData?: Partial<ValuesDiscovery>;
  goalsData?: Partial<FinancialGoals>;
  onSave: (data: FinancialPurpose) => void;
  onAutoSave?: (data: Partial<FinancialPurpose>) => void;
  isAdvisorMode?: boolean;
  clientName?: string;
}

export function FinancialPurposeForm({
  initialData,
  valuesData,
  goalsData,
  onSave,
  onAutoSave,
  isAdvisorMode = false,
}: FinancialPurposeFormProps): JSX.Element {
  // Determine initial step based on existing data
  const getInitialStep = (): WizardStep => {
    if (!initialData) return 'intro';
    if (initialData.completedAt) return 'summary';
    if (initialData.step6CompletedAt) return 'summary';
    if (initialData.step5CompletedAt) return 'refinement';
    if (initialData.step4CompletedAt) return 'drafts';
    if (initialData.step3CompletedAt) return 'visionAnchors';
    if (initialData.step2CompletedAt) return 'tradeoffs';
    if (initialData.primaryDriver) return 'drivers';
    return 'intro';
  };

  const [currentStep, setCurrentStep] = useState<WizardStep>(getInitialStep);

  // Form state
  const [formData, setFormData] = useState<Partial<FinancialPurpose>>(() => ({
    state: 'NOT_STARTED',
    tradeoffAnchors: [],
    visionAnchors: [],
    drafts: [],
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
    setCurrentStep('confirmInputs');
  }, []);

  // Step 1: Confirm inputs complete
  const handleConfirmInputsComplete = useCallback(() => {
    setCurrentStep('drivers');
  }, []);

  // Step 2: Handle driver selection
  const handleDriversChange = useCallback((primary: PurposeDriver, secondary?: PurposeDriver) => {
    setFormData((prev) => ({
      ...prev,
      primaryDriver: primary,
      secondaryDriver: secondary,
    }));
  }, []);

  const handleDriversComplete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      step2CompletedAt: new Date().toISOString(),
    }));
    setCurrentStep('tradeoffs');
  }, []);

  // Step 3: Handle tradeoff anchors
  const handleTradeoffChange = useCallback((anchors: TradeoffAnchor[]) => {
    setFormData((prev) => ({
      ...prev,
      tradeoffAnchors: anchors,
    }));
  }, []);

  const handleTradeoffsComplete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      step3CompletedAt: new Date().toISOString(),
    }));
    setCurrentStep('visionAnchors');
  }, []);

  // Step 4: Handle vision anchors
  const handleVisionAnchorsChange = useCallback((anchors: string[]) => {
    setFormData((prev) => ({
      ...prev,
      visionAnchors: anchors,
    }));
  }, []);

  const handleVisionAnchorsComplete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      step4CompletedAt: new Date().toISOString(),
    }));
    setCurrentStep('drafts');
  }, []);

  // Step 5: Handle draft selection
  const handleDraftsChange = useCallback((drafts: SoFPDraft[], selectedId?: string) => {
    setFormData((prev) => ({
      ...prev,
      drafts,
      selectedDraftId: selectedId,
    }));
  }, []);

  const handleDraftsComplete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      step5CompletedAt: new Date().toISOString(),
    }));
    setCurrentStep('refinement');
  }, []);

  // Step 6: Handle refinement
  const handleFinalTextChange = useCallback((text: string, missingValues?: string[], notes?: string) => {
    setFormData((prev) => ({
      ...prev,
      finalText: text,
      missingValues,
      notes,
    }));
  }, []);

  const handleRefinementComplete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      step6CompletedAt: new Date().toISOString(),
    }));
    setCurrentStep('summary');
  }, []);

  // Final completion
  const handleComplete = useCallback(() => {
    const completedData: FinancialPurpose = {
      state: 'COMPLETED',
      primaryDriver: formData.primaryDriver,
      secondaryDriver: formData.secondaryDriver,
      tradeoffAnchors: formData.tradeoffAnchors || [],
      visionAnchors: formData.visionAnchors || [],
      drafts: formData.drafts || [],
      selectedDraftId: formData.selectedDraftId,
      finalText: formData.finalText,
      missingValues: formData.missingValues,
      notes: formData.notes,
      step2CompletedAt: formData.step2CompletedAt,
      step3CompletedAt: formData.step3CompletedAt,
      step4CompletedAt: formData.step4CompletedAt,
      step5CompletedAt: formData.step5CompletedAt,
      step6CompletedAt: formData.step6CompletedAt,
      completedAt: new Date().toISOString(),
    };
    onSave(completedData);
  }, [formData, onSave]);

  // Navigation helpers
  const goToConfirmInputs = useCallback(() => setCurrentStep('confirmInputs'), []);
  const goToDrivers = useCallback(() => setCurrentStep('drivers'), []);
  const goToTradeoffs = useCallback(() => setCurrentStep('tradeoffs'), []);
  const goToVisionAnchors = useCallback(() => setCurrentStep('visionAnchors'), []);
  const goToDrafts = useCallback(() => setCurrentStep('drafts'), []);
  const goToRefinement = useCallback(() => setCurrentStep('refinement'), []);

  // Render current step
  const renderStep = (): JSX.Element => {
    switch (currentStep) {
      case 'intro':
        return (
          <PurposeIntro
            onStart={handleStart}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'confirmInputs':
        return (
          <ConfirmInputsStep
            valuesData={valuesData}
            goalsData={goalsData}
            onComplete={handleConfirmInputsComplete}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'drivers':
        return (
          <PurposeDriversStep
            primaryDriver={formData.primaryDriver}
            secondaryDriver={formData.secondaryDriver}
            onDriversChange={handleDriversChange}
            onComplete={handleDriversComplete}
            onBack={goToConfirmInputs}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'tradeoffs':
        return (
          <TradeoffAnchorStep
            tradeoffAnchors={formData.tradeoffAnchors || []}
            onAnchorsChange={handleTradeoffChange}
            onComplete={handleTradeoffsComplete}
            onBack={goToDrivers}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'visionAnchors':
        return (
          <VisionAnchorStep
            selectedAnchors={formData.visionAnchors || []}
            onAnchorsChange={handleVisionAnchorsChange}
            onComplete={handleVisionAnchorsComplete}
            onBack={goToTradeoffs}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'drafts':
        return (
          <DraftAssemblyStep
            primaryDriver={formData.primaryDriver}
            secondaryDriver={formData.secondaryDriver}
            tradeoffAnchors={formData.tradeoffAnchors || []}
            visionAnchors={formData.visionAnchors || []}
            drafts={formData.drafts || []}
            selectedDraftId={formData.selectedDraftId}
            onDraftsChange={handleDraftsChange}
            onComplete={handleDraftsComplete}
            onBack={goToVisionAnchors}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'refinement':
        return (
          <RefinementStep
            drafts={formData.drafts || []}
            selectedDraftId={formData.selectedDraftId}
            finalText={formData.finalText}
            valuesData={valuesData}
            onFinalTextChange={handleFinalTextChange}
            onComplete={handleRefinementComplete}
            onBack={goToDrafts}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'summary':
        return (
          <PurposeSummary
            data={formData as FinancialPurpose}
            tradeoffAnchors={formData.tradeoffAnchors || []}
            onComplete={handleComplete}
            onBack={goToRefinement}
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
    { key: 'confirmInputs', label: 'Review' },
    { key: 'drivers', label: 'Drivers' },
    { key: 'tradeoffs', label: 'Tradeoffs' },
    { key: 'visionAnchors', label: 'Vision' },
    { key: 'drafts', label: 'Drafts' },
    { key: 'refinement', label: 'Refine' },
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
