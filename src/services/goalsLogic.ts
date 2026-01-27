/**
 * Financial Goals Logic
 * Business logic for goal prioritization, core planning goal identification,
 * and goal conflict detection
 */

import type { FinancialGoal, GoalCategory, FinancialGoalTradeoff } from '@/types/financialGoals';

/**
 * Determines if a goal qualifies as a "core planning goal"
 * Core planning goals are used to drive the financial plan
 *
 * Criteria:
 * - HIGH priority with FIXED flexibility
 * - HIGH priority with SHORT or MID term horizon
 */
export function isCorePlanningGoal(goal: FinancialGoal): boolean {
  // Must be high priority
  if (goal.priority !== 'HIGH') {
    return false;
  }

  // FIXED flexibility makes it core
  if (goal.flexibility === 'FIXED') {
    return true;
  }

  // SHORT or MID term horizon makes it core
  if (goal.timeHorizon === 'SHORT' || goal.timeHorizon === 'MID') {
    return true;
  }

  return false;
}

/**
 * Identifies all core planning goals from a list of goals
 */
export function identifyCoreGoals(goals: FinancialGoal[]): FinancialGoal[] {
  return goals.filter(isCorePlanningGoal).map((goal) => ({
    ...goal,
    isCorePlanningGoal: true,
  }));
}

/**
 * Updates all goals with their core planning goal status
 */
export function markCoreGoals(goals: FinancialGoal[]): FinancialGoal[] {
  return goals.map((goal) => ({
    ...goal,
    isCorePlanningGoal: isCorePlanningGoal(goal),
  }));
}

/**
 * Potential conflict pairs between goal categories
 * These represent common tensions in financial planning
 */
const GOAL_CONFLICT_PAIRS: Array<[GoalCategory, GoalCategory, string]> = [
  ['LIFESTYLE', 'SECURITY_PROTECTION', 'Lifestyle vs Security'],
  ['RETIREMENT', 'FAMILY_LEGACY', 'Retirement vs Family Legacy'],
  ['CAREER_GROWTH', 'RETIREMENT', 'Career Growth vs Early Retirement'],
  ['GIVING', 'LIFESTYLE', 'Giving vs Lifestyle'],
  ['MAJOR_PURCHASES', 'SECURITY_PROTECTION', 'Major Purchases vs Security'],
  ['FAMILY_LEGACY', 'LIFESTYLE', 'Family Support vs Lifestyle'],
];

/**
 * Detects potential conflicts between high-priority goals
 * Returns pairs of goals that may require tradeoff discussions
 */
export function detectGoalConflicts(
  goals: FinancialGoal[]
): Array<{ goal1: FinancialGoal; goal2: FinancialGoal; conflictType: string }> {
  const highPriorityGoals = goals.filter((g) => g.priority === 'HIGH');
  const conflicts: Array<{ goal1: FinancialGoal; goal2: FinancialGoal; conflictType: string }> = [];

  // Check each conflict pair
  for (const [cat1, cat2, conflictType] of GOAL_CONFLICT_PAIRS) {
    const goalsInCat1 = highPriorityGoals.filter((g) => g.category === cat1);
    const goalsInCat2 = highPriorityGoals.filter((g) => g.category === cat2);

    // If both categories have high-priority goals, there's potential conflict
    if (goalsInCat1.length > 0 && goalsInCat2.length > 0) {
      // Create conflict pairs (limit to first of each category to avoid too many)
      conflicts.push({
        goal1: goalsInCat1[0],
        goal2: goalsInCat2[0],
        conflictType,
      });
    }
  }

  return conflicts;
}

/**
 * Generates tradeoff questions for high-priority goals
 * Returns pairs of goals that should be compared
 */
export function generateGoalTradeoffPairs(
  goals: FinancialGoal[],
  maxPairs: number = 4
): Array<{ goal1: FinancialGoal; goal2: FinancialGoal }> {
  const highPriorityGoals = goals.filter((g) => g.priority === 'HIGH');

  if (highPriorityGoals.length < 2) {
    return [];
  }

  const pairs: Array<{ goal1: FinancialGoal; goal2: FinancialGoal }> = [];

  // First, add any conflict pairs (more meaningful comparisons)
  const conflicts = detectGoalConflicts(goals);
  for (const conflict of conflicts) {
    if (pairs.length >= maxPairs) break;
    pairs.push({ goal1: conflict.goal1, goal2: conflict.goal2 });
  }

  // If we need more pairs, add some based on time horizon differences
  if (pairs.length < maxPairs) {
    const shortTermGoals = highPriorityGoals.filter(
      (g) => g.timeHorizon === 'SHORT' || g.timeHorizon === 'MID'
    );
    const longTermGoals = highPriorityGoals.filter(
      (g) => g.timeHorizon === 'LONG' || g.timeHorizon === 'ONGOING'
    );

    for (const shortGoal of shortTermGoals) {
      if (pairs.length >= maxPairs) break;
      for (const longGoal of longTermGoals) {
        if (pairs.length >= maxPairs) break;
        // Check if this pair already exists
        const exists = pairs.some(
          (p) =>
            (p.goal1.id === shortGoal.id && p.goal2.id === longGoal.id) ||
            (p.goal1.id === longGoal.id && p.goal2.id === shortGoal.id)
        );
        if (!exists) {
          pairs.push({ goal1: shortGoal, goal2: longGoal });
        }
      }
    }
  }

  return pairs;
}

/**
 * Gets goals organized by priority for display
 */
export function getGoalsByPriority(goals: FinancialGoal[]): {
  high: FinancialGoal[];
  medium: FinancialGoal[];
  low: FinancialGoal[];
  notFocus: FinancialGoal[];
} {
  return {
    high: goals.filter((g) => g.priority === 'HIGH'),
    medium: goals.filter((g) => g.priority === 'MEDIUM'),
    low: goals.filter((g) => g.priority === 'LOW'),
    notFocus: goals.filter((g) => g.priority === 'NA'),
  };
}

/**
 * Gets goals organized by time horizon for display
 */
export function getGoalsByTimeHorizon(goals: FinancialGoal[]): {
  short: FinancialGoal[];
  mid: FinancialGoal[];
  long: FinancialGoal[];
  ongoing: FinancialGoal[];
} {
  return {
    short: goals.filter((g) => g.timeHorizon === 'SHORT'),
    mid: goals.filter((g) => g.timeHorizon === 'MID'),
    long: goals.filter((g) => g.timeHorizon === 'LONG'),
    ongoing: goals.filter((g) => g.timeHorizon === 'ONGOING'),
  };
}

/**
 * Gets category counts from a list of goals
 */
export function getGoalCategoryCounts(goals: FinancialGoal[]): Record<GoalCategory, number> {
  const counts: Record<GoalCategory, number> = {
    LIFESTYLE: 0,
    SECURITY_PROTECTION: 0,
    FAMILY_LEGACY: 0,
    CAREER_GROWTH: 0,
    RETIREMENT: 0,
    HEALTH: 0,
    MAJOR_PURCHASES: 0,
    GIVING: 0,
  };

  for (const goal of goals) {
    counts[goal.category]++;
  }

  return counts;
}

/**
 * Computes tradeoff "wins" from tradeoff responses
 * Returns a map of goalId to win count
 */
export function computeTradeoffWins(
  tradeoffs: FinancialGoalTradeoff[]
): Record<string, number> {
  const wins: Record<string, number> = {};

  for (const tradeoff of tradeoffs) {
    if (!wins[tradeoff.goalId1]) wins[tradeoff.goalId1] = 0;
    if (!wins[tradeoff.goalId2]) wins[tradeoff.goalId2] = 0;

    if (tradeoff.choice === 'GOAL1') {
      wins[tradeoff.goalId1]++;
    } else if (tradeoff.choice === 'GOAL2') {
      wins[tradeoff.goalId2]++;
    }
    // NEUTRAL doesn't add wins to either
  }

  return wins;
}

/**
 * Sorts goals by their tradeoff wins (highest first)
 */
export function sortGoalsByTradeoffWins(
  goals: FinancialGoal[],
  tradeoffs: FinancialGoalTradeoff[]
): FinancialGoal[] {
  const wins = computeTradeoffWins(tradeoffs);

  return [...goals].sort((a, b) => {
    const winsA = wins[a.id] || 0;
    const winsB = wins[b.id] || 0;
    return winsB - winsA;
  });
}

/**
 * Validates that all high/medium priority goals have time horizons assigned
 */
export function validateTimeHorizons(goals: FinancialGoal[]): {
  isValid: boolean;
  missingCount: number;
  missingGoals: FinancialGoal[];
} {
  const goalsNeedingTimeHorizon = goals.filter(
    (g) => (g.priority === 'HIGH' || g.priority === 'MEDIUM') && !g.timeHorizon
  );

  return {
    isValid: goalsNeedingTimeHorizon.length === 0,
    missingCount: goalsNeedingTimeHorizon.length,
    missingGoals: goalsNeedingTimeHorizon,
  };
}

/**
 * Validates that all high priority goals have flexibility assigned
 */
export function validateFlexibility(goals: FinancialGoal[]): {
  isValid: boolean;
  missingCount: number;
  missingGoals: FinancialGoal[];
} {
  const goalsNeedingFlexibility = goals.filter(
    (g) => g.priority === 'HIGH' && !g.flexibility
  );

  return {
    isValid: goalsNeedingFlexibility.length === 0,
    missingCount: goalsNeedingFlexibility.length,
    missingGoals: goalsNeedingFlexibility,
  };
}

/**
 * Gets a summary of goals for display
 */
export function getGoalsSummary(goals: FinancialGoal[]): {
  total: number;
  userGenerated: number;
  systemSelected: number;
  highPriority: number;
  coreGoals: number;
  byCategory: Record<GoalCategory, number>;
} {
  return {
    total: goals.length,
    userGenerated: goals.filter((g) => g.source === 'user').length,
    systemSelected: goals.filter((g) => g.source === 'system').length,
    highPriority: goals.filter((g) => g.priority === 'HIGH').length,
    coreGoals: goals.filter((g) => g.isCorePlanningGoal).length,
    byCategory: getGoalCategoryCounts(goals),
  };
}
