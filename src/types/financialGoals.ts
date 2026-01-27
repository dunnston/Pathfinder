/**
 * Financial Goals types
 * Goal card exercise with prioritization and time horizon assignment
 */

/** Goal category (internal, not shown to users) */
export type GoalCategory =
  | 'LIFESTYLE'
  | 'SECURITY_PROTECTION'
  | 'FAMILY_LEGACY'
  | 'CAREER_GROWTH'
  | 'RETIREMENT'
  | 'HEALTH'
  | 'MAJOR_PURCHASES'
  | 'GIVING';

/** Goal priority level */
export type GoalPriority = 'HIGH' | 'MEDIUM' | 'LOW' | 'NA';

/** Goal time horizon */
export type GoalTimeHorizon = 'SHORT' | 'MID' | 'LONG' | 'ONGOING';

/** Goal flexibility level */
export type GoalFlexibility = 'FIXED' | 'FLEXIBLE' | 'DEFERABLE';

/** Module completion state */
export type FinancialGoalsState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

/** Source of the goal (user-generated or system-suggested) */
export type GoalSource = 'user' | 'system';

/** A financial goal */
export interface FinancialGoal {
  id: string;
  label: string;
  source: GoalSource;
  priority: GoalPriority;
  timeHorizon?: GoalTimeHorizon;
  flexibility?: GoalFlexibility;
  isCorePlanningGoal: boolean;
  category: GoalCategory;
  notes?: string;
  createdAt: string;
}

/** A goal tradeoff comparison */
export interface FinancialGoalTradeoff {
  goalId1: string;
  goalId2: string;
  choice: 'GOAL1' | 'GOAL2' | 'NEUTRAL';
  reasoning?: string;
}

/** Complete financial goals section */
export interface FinancialGoals {
  state: FinancialGoalsState;

  // Phase 1: Free recall (user-generated goals)
  userGeneratedGoals: FinancialGoal[];
  phase1CompletedAt?: string;

  // Phase 2: System prompts (system-suggested goals selected by user)
  systemSelectedGoals: FinancialGoal[];
  phase2CompletedAt?: string;

  // Phase 3: Priority sort (all goals with priorities assigned)
  allGoals: FinancialGoal[];
  phase3CompletedAt?: string;

  // Phase 4: Time horizon (time horizons assigned to high/medium goals)
  phase4CompletedAt?: string;

  // Phase 5: Flexibility test (flexibility assigned to high priority goals)
  tradeoffs: FinancialGoalTradeoff[];
  phase5CompletedAt?: string;

  // Phase 6: Final top goals (core planning goals identified)
  coreGoals: FinancialGoal[];
  phase6CompletedAt?: string;

  completedAt?: string;
}
