/**
 * Financial Goals Form Component
 * Main wizard container for the financial goals section (Enhanced)
 * Steps: Intro -> Free Recall -> System Cards -> Priority Sort -> Time Horizon -> Flexibility -> Final Goals
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { FinancialGoals, FinancialGoal, GoalPriority, GoalTimeHorizon, GoalFlexibility } from '@/types/financialGoals';
import { FreeRecallStep } from './goals/FreeRecallStep';
import { SystemGoalCards } from './goals/SystemGoalCards';
import { PrioritySortStep } from './goals/PrioritySortStep';
import { TimeHorizonStep } from './goals/TimeHorizonStep';
import { FlexibilityTestStep } from './goals/FlexibilityTestStep';
import { FinalGoalsList } from './goals/FinalGoalsList';
import { Button } from '@/components/common';

type WizardPhase = 'intro' | 'freeRecall' | 'systemCards' | 'prioritySort' | 'timeHorizon' | 'flexibility' | 'finalGoals';

interface FinancialGoalsFormProps {
  initialData?: Partial<FinancialGoals>;
  onSave: (data: FinancialGoals) => void;
  onAutoSave?: (data: Partial<FinancialGoals>) => void;
  isAdvisorMode?: boolean;
  clientName?: string;
}

export function FinancialGoalsForm({
  initialData,
  onSave,
  onAutoSave,
  isAdvisorMode = false,
}: FinancialGoalsFormProps): JSX.Element {
  // Determine initial phase based on existing data
  const getInitialPhase = (): WizardPhase => {
    if (!initialData) return 'intro';
    if (initialData.completedAt) return 'finalGoals';
    if (initialData.phase6CompletedAt) return 'finalGoals';
    if (initialData.phase5CompletedAt) return 'finalGoals';
    if (initialData.phase4CompletedAt) return 'flexibility';
    if (initialData.phase3CompletedAt) return 'timeHorizon';
    if (initialData.phase2CompletedAt) return 'prioritySort';
    if (initialData.phase1CompletedAt) return 'systemCards';
    if (initialData.userGeneratedGoals && initialData.userGeneratedGoals.length > 0) return 'freeRecall';
    return 'intro';
  };

  const [currentPhase, setCurrentPhase] = useState<WizardPhase>(getInitialPhase);

  // Form state
  const [formData, setFormData] = useState<Partial<FinancialGoals>>(() => ({
    state: 'NOT_STARTED',
    userGeneratedGoals: [],
    systemSelectedGoals: [],
    allGoals: [],
    tradeoffs: [],
    coreGoals: [],
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
    setCurrentPhase('freeRecall');
  }, []);

  // Phase 1: Handle user-generated goals
  const handleUserGoalsChange = useCallback((goals: FinancialGoal[]) => {
    setFormData((prev) => ({
      ...prev,
      userGeneratedGoals: goals,
    }));
  }, []);

  const handlePhase1Complete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      phase1CompletedAt: new Date().toISOString(),
    }));
    setCurrentPhase('systemCards');
  }, []);

  // Phase 2: Handle system card selections
  const handleSystemGoalsChange = useCallback((goals: FinancialGoal[]) => {
    setFormData((prev) => ({
      ...prev,
      systemSelectedGoals: goals,
    }));
  }, []);

  const handlePhase2Complete = useCallback(() => {
    // Merge user and system goals for priority sorting
    const allGoals = [
      ...(formData.userGeneratedGoals || []),
      ...(formData.systemSelectedGoals || []),
    ];
    setFormData((prev) => ({
      ...prev,
      allGoals,
      phase2CompletedAt: new Date().toISOString(),
    }));
    setCurrentPhase('prioritySort');
  }, [formData.userGeneratedGoals, formData.systemSelectedGoals]);

  // Phase 3: Handle priority sorting
  const handlePriorityChange = useCallback((goalId: string, priority: GoalPriority) => {
    setFormData((prev) => ({
      ...prev,
      allGoals: (prev.allGoals || []).map((goal) =>
        goal.id === goalId ? { ...goal, priority } : goal
      ),
    }));
  }, []);

  const handlePhase3Complete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      phase3CompletedAt: new Date().toISOString(),
    }));
    setCurrentPhase('timeHorizon');
  }, []);

  // Phase 4: Handle time horizon assignment
  const handleTimeHorizonChange = useCallback((goalId: string, timeHorizon: GoalTimeHorizon) => {
    setFormData((prev) => ({
      ...prev,
      allGoals: (prev.allGoals || []).map((goal) =>
        goal.id === goalId ? { ...goal, timeHorizon } : goal
      ),
    }));
  }, []);

  const handlePhase4Complete = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      phase4CompletedAt: new Date().toISOString(),
    }));
    setCurrentPhase('flexibility');
  }, []);

  // Phase 5: Handle flexibility assignment
  const handleFlexibilityChange = useCallback((goalId: string, flexibility: GoalFlexibility) => {
    setFormData((prev) => ({
      ...prev,
      allGoals: (prev.allGoals || []).map((goal) =>
        goal.id === goalId ? { ...goal, flexibility } : goal
      ),
    }));
  }, []);

  const handlePhase5Complete = useCallback(() => {
    // Identify core planning goals based on priority, time horizon, and flexibility
    const coreGoals = (formData.allGoals || []).filter((goal) => {
      // High priority with FIXED flexibility
      if (goal.priority === 'HIGH' && goal.flexibility === 'FIXED') return true;
      // High priority with short/mid term horizon
      if (goal.priority === 'HIGH' && (goal.timeHorizon === 'SHORT' || goal.timeHorizon === 'MID')) return true;
      return false;
    });

    setFormData((prev) => ({
      ...prev,
      allGoals: (prev.allGoals || []).map((goal) => ({
        ...goal,
        isCorePlanningGoal: coreGoals.some((cg) => cg.id === goal.id),
      })),
      coreGoals: coreGoals.map((g) => ({ ...g, isCorePlanningGoal: true })),
      phase5CompletedAt: new Date().toISOString(),
    }));
    setCurrentPhase('finalGoals');
  }, [formData.allGoals]);

  // Phase 6: Handle core goal updates
  const handleCoreGoalToggle = useCallback((goalId: string, isCore: boolean) => {
    setFormData((prev) => {
      const allGoals = (prev.allGoals || []).map((goal) =>
        goal.id === goalId ? { ...goal, isCorePlanningGoal: isCore } : goal
      );
      const coreGoals = allGoals.filter((g) => g.isCorePlanningGoal);
      return { ...prev, allGoals, coreGoals };
    });
  }, []);

  // Final completion
  const handleComplete = useCallback(() => {
    const completedData: FinancialGoals = {
      state: 'COMPLETED',
      userGeneratedGoals: formData.userGeneratedGoals || [],
      systemSelectedGoals: formData.systemSelectedGoals || [],
      allGoals: formData.allGoals || [],
      tradeoffs: formData.tradeoffs || [],
      coreGoals: (formData.allGoals || []).filter((g) => g.isCorePlanningGoal),
      phase1CompletedAt: formData.phase1CompletedAt,
      phase2CompletedAt: formData.phase2CompletedAt,
      phase3CompletedAt: formData.phase3CompletedAt,
      phase4CompletedAt: formData.phase4CompletedAt,
      phase5CompletedAt: formData.phase5CompletedAt,
      phase6CompletedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    onSave(completedData);
  }, [formData, onSave]);

  // Navigation helpers
  const goToFreeRecall = useCallback(() => setCurrentPhase('freeRecall'), []);
  const goToSystemCards = useCallback(() => setCurrentPhase('systemCards'), []);
  const goToPrioritySort = useCallback(() => setCurrentPhase('prioritySort'), []);
  const goToTimeHorizon = useCallback(() => setCurrentPhase('timeHorizon'), []);
  const goToFlexibility = useCallback(() => setCurrentPhase('flexibility'), []);

  // Render current phase
  const renderPhase = (): JSX.Element => {
    switch (currentPhase) {
      case 'intro':
        return (
          <IntroStep
            onStart={handleStart}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'freeRecall':
        return (
          <FreeRecallStep
            goals={formData.userGeneratedGoals || []}
            onGoalsChange={handleUserGoalsChange}
            onComplete={handlePhase1Complete}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'systemCards':
        return (
          <SystemGoalCards
            selectedGoals={formData.systemSelectedGoals || []}
            userGoals={formData.userGeneratedGoals || []}
            onSelectionChange={handleSystemGoalsChange}
            onComplete={handlePhase2Complete}
            onBack={goToFreeRecall}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'prioritySort':
        return (
          <PrioritySortStep
            goals={formData.allGoals || []}
            onPriorityChange={handlePriorityChange}
            onComplete={handlePhase3Complete}
            onBack={goToSystemCards}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'timeHorizon':
        return (
          <TimeHorizonStep
            goals={(formData.allGoals || []).filter(
              (g) => g.priority === 'HIGH' || g.priority === 'MEDIUM'
            )}
            onTimeHorizonChange={handleTimeHorizonChange}
            onComplete={handlePhase4Complete}
            onBack={goToPrioritySort}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'flexibility':
        return (
          <FlexibilityTestStep
            goals={formData.allGoals || []}
            onFlexibilityChange={handleFlexibilityChange}
            onComplete={handlePhase5Complete}
            onBack={goToTimeHorizon}
            isAdvisorMode={isAdvisorMode}
          />
        );

      case 'finalGoals':
        return (
          <FinalGoalsList
            allGoals={formData.allGoals || []}
            onCoreToggle={handleCoreGoalToggle}
            onComplete={handleComplete}
            onBack={goToFlexibility}
            isAdvisorMode={isAdvisorMode}
          />
        );

      default:
        return <div>Unknown phase</div>;
    }
  };

  // Progress indicator
  const phases: { key: WizardPhase; label: string }[] = [
    { key: 'intro', label: 'Start' },
    { key: 'freeRecall', label: 'Your Goals' },
    { key: 'systemCards', label: 'Common' },
    { key: 'prioritySort', label: 'Priority' },
    { key: 'timeHorizon', label: 'Timing' },
    { key: 'flexibility', label: 'Flexibility' },
    { key: 'finalGoals', label: 'Summary' },
  ];

  const currentPhaseIndex = phases.findIndex((p) => p.key === currentPhase);

  return (
    <div className="space-y-6">
      {/* Phase progress indicator - compact and responsive */}
      {currentPhase !== 'intro' && (
        <div className="space-y-3">
          {/* Step counter and label */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {phases.find((p) => p.key === currentPhase)?.label}
            </span>
            <span className="text-sm text-gray-500">
              Step {currentPhaseIndex} of {phases.length - 1}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentPhaseIndex) / (phases.length - 1)) * 100}%` }}
            />
          </div>
          {/* Step dots - mobile friendly */}
          <div className="flex justify-between">
            {phases.slice(1).map((phase, index) => {
              const isActive = phase.key === currentPhase;
              const isComplete = currentPhaseIndex > index + 1;

              return (
                <div
                  key={phase.key}
                  className={`
                    w-2.5 h-2.5 rounded-full transition-colors
                    ${isComplete ? 'bg-green-500' : isActive ? 'bg-primary' : 'bg-gray-300'}
                  `}
                  title={phase.label}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Phase content */}
      {renderPhase()}
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
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {isAdvisorMode ? 'Financial Goals' : 'Define Your Financial Goals'}
        </h2>
        <p className="text-lg text-gray-600">
          {isAdvisorMode
            ? "This exercise identifies and prioritizes the client's financial objectives to guide planning decisions."
            : "This exercise helps identify and prioritize what you want to achieve with your money so your plan can focus on what matters most."}
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
              <strong>Share your goals</strong> - Tell us what comes to mind when you think about your financial future
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              2
            </span>
            <span className="text-gray-600">
              <strong>Review common goals</strong> - Add any additional goals that resonate with you
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              3
            </span>
            <span className="text-gray-600">
              <strong>Set priorities & timing</strong> - Sort goals by importance and add time horizons
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              4
            </span>
            <span className="text-gray-600">
              <strong>Test flexibility</strong> - Identify which goals are fixed vs. flexible
            </span>
          </li>
        </ul>
      </div>

      {/* Time estimate */}
      <p className="text-sm text-gray-500">
        Estimated time: 8-12 minutes
      </p>

      {/* Start button */}
      <Button onClick={onStart} className="px-8">
        Start Goal Discovery
      </Button>
    </div>
  );
}
