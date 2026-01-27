/**
 * DiscoveryInsightsPanel Component
 * Displays the complete discovery insights including strategy profile,
 * focus areas, and action recommendations
 */

import type {
  DiscoveryInsights,
  PlanningFocusRanking,
  ActionRecommendations,
  StrategyProfile,
} from '@/types/strategyProfile';
import {
  INCOME_STRATEGY_LABELS,
  TIMING_SENSITIVITY_LABELS,
  PLANNING_FLEXIBILITY_LABELS,
  COMPLEXITY_TOLERANCE_LABELS,
  GUIDANCE_LEVEL_LABELS,
  PLANNING_DOMAIN_LABELS,
  ACTION_TYPE_LABELS,
  ACTION_GUIDANCE_LABELS,
  ACTION_URGENCY_LABELS,
} from '@/types/strategyProfile';

interface DiscoveryInsightsPanelProps {
  insights: DiscoveryInsights;
  isAdvisorMode?: boolean;
}

export function DiscoveryInsightsPanel({
  insights,
  isAdvisorMode = false,
}: DiscoveryInsightsPanelProps): JSX.Element {
  return (
    <div className="space-y-8">
      {/* Input Summary */}
      <DataCompletenessCard summary={insights.inputSummary} />

      {/* Strategy Profile */}
      <StrategyProfileCard
        profile={insights.strategyProfile}
        isAdvisorMode={isAdvisorMode}
      />

      {/* Planning Focus Areas */}
      <FocusAreasCard
        focusAreas={insights.focusAreas}
        isAdvisorMode={isAdvisorMode}
      />

      {/* Action Recommendations */}
      <ActionRecommendationsCard
        actions={insights.actions}
        isAdvisorMode={isAdvisorMode}
      />
    </div>
  );
}

// ============================================================
// DATA COMPLETENESS CARD
// ============================================================

interface DataCompletenessCardProps {
  summary: DiscoveryInsights['inputSummary'];
}

function DataCompletenessCard({ summary }: DataCompletenessCardProps): JSX.Element {
  const completionColor =
    summary.completionPercentage >= 75
      ? 'bg-green-500'
      : summary.completionPercentage >= 50
        ? 'bg-yellow-500'
        : summary.completionPercentage >= 25
          ? 'bg-orange-500'
          : 'bg-red-500';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Data Completeness</h3>
        <span className="text-2xl font-bold text-gray-900">
          {summary.completionPercentage}%
        </span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full ${completionColor} transition-all duration-500`}
          style={{ width: `${summary.completionPercentage}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <DataBadge label="Basic Context" present={summary.hasBasicContext} />
        <DataBadge label="Values" present={summary.hasValues} />
        <DataBadge label="Goals" present={summary.hasGoals} />
        <DataBadge label="Purpose" present={summary.hasPurpose} />
      </div>
    </div>
  );
}

function DataBadge({ label, present }: { label: string; present: boolean }): JSX.Element {
  return (
    <span
      className={`
        px-3 py-1 rounded-full text-sm font-medium
        ${present ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}
      `}
    >
      {present ? '✓' : '○'} {label}
    </span>
  );
}

// ============================================================
// STRATEGY PROFILE CARD
// ============================================================

interface StrategyProfileCardProps {
  profile: StrategyProfile;
  isAdvisorMode: boolean;
}

function StrategyProfileCard({ profile, isAdvisorMode }: StrategyProfileCardProps): JSX.Element {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isAdvisorMode ? "Client's Planning Posture" : 'Your Planning Posture'}
      </h3>

      {/* Summary paragraph */}
      <p className="text-gray-700 mb-6 leading-relaxed">{profile.summary}</p>

      {/* Dimension grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DimensionCard
          title="Income Strategy"
          value={INCOME_STRATEGY_LABELS[profile.incomeStrategy.value]}
          confidence={profile.incomeStrategy.confidence}
          rationale={profile.incomeStrategy.rationale}
        />
        <DimensionCard
          title="Timing Sensitivity"
          value={TIMING_SENSITIVITY_LABELS[profile.timingSensitivity.value]}
          confidence={profile.timingSensitivity.confidence}
          rationale={profile.timingSensitivity.rationale}
        />
        <DimensionCard
          title="Planning Flexibility"
          value={PLANNING_FLEXIBILITY_LABELS[profile.planningFlexibility.value]}
          confidence={profile.planningFlexibility.confidence}
          rationale={profile.planningFlexibility.rationale}
        />
        <DimensionCard
          title="Complexity Tolerance"
          value={COMPLEXITY_TOLERANCE_LABELS[profile.complexityTolerance.value]}
          confidence={profile.complexityTolerance.confidence}
          rationale={profile.complexityTolerance.rationale}
        />
        <DimensionCard
          title="Guidance Needed"
          value={GUIDANCE_LEVEL_LABELS[profile.guidanceLevel.value]}
          confidence={profile.guidanceLevel.confidence}
          rationale={profile.guidanceLevel.rationale}
        />
      </div>
    </div>
  );
}

interface DimensionCardProps {
  title: string;
  value: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  rationale: string;
}

function DimensionCard({ title, value, confidence, rationale }: DimensionCardProps): JSX.Element {
  const confidenceColor =
    confidence === 'HIGH'
      ? 'text-green-600'
      : confidence === 'MEDIUM'
        ? 'text-yellow-600'
        : 'text-gray-400';

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <span className={`text-xs ${confidenceColor}`}>
          {confidence === 'HIGH' ? '●●●' : confidence === 'MEDIUM' ? '●●○' : '●○○'}
        </span>
      </div>
      <p className="text-base font-semibold text-gray-900 mb-2">{value}</p>
      <p className="text-xs text-gray-500">{rationale}</p>
    </div>
  );
}

// ============================================================
// FOCUS AREAS CARD
// ============================================================

interface FocusAreasCardProps {
  focusAreas: PlanningFocusRanking;
  isAdvisorMode: boolean;
}

function FocusAreasCard({ focusAreas, isAdvisorMode }: FocusAreasCardProps): JSX.Element {
  // Show top 6 focus areas
  const displayAreas = focusAreas.areas.slice(0, 6);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Planning Focus Areas
      </h3>
      <p className="text-gray-600 text-sm mb-6">
        {isAdvisorMode
          ? 'Prioritized planning domains based on client values, goals, and circumstances.'
          : 'Where your planning effort should be focused, based on your values, goals, and circumstances.'}
      </p>

      <div className="space-y-3">
        {displayAreas.map((area) => (
          <FocusAreaRow key={area.domain} area={area} />
        ))}
      </div>
    </div>
  );
}

interface FocusAreaRowProps {
  area: PlanningFocusRanking['areas'][0];
}

function FocusAreaRow({ area }: FocusAreaRowProps): JSX.Element {
  const importanceColor = {
    CRITICAL: 'bg-red-100 text-red-800 border-red-200',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
    MODERATE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    LOW: 'bg-gray-100 text-gray-600 border-gray-200',
  }[area.importance];

  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
        {area.priority}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-gray-900">
            {PLANNING_DOMAIN_LABELS[area.domain]}
          </h4>
          <span className={`px-2 py-0.5 text-xs font-medium rounded border ${importanceColor}`}>
            {area.importance}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{area.rationale}</p>
        {(area.valueConnections.length > 0 || area.goalConnections.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {area.valueConnections.map((v, i) => (
              <span key={`v-${i}`} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded">
                {v}
              </span>
            ))}
            {area.goalConnections.map((g, i) => (
              <span key={`g-${i}`} className="px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ACTION RECOMMENDATIONS CARD
// ============================================================

interface ActionRecommendationsCardProps {
  actions: ActionRecommendations;
  isAdvisorMode: boolean;
}

function ActionRecommendationsCard({
  actions,
  isAdvisorMode,
}: ActionRecommendationsCardProps): JSX.Element {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recommended Actions
      </h3>
      <p className="text-gray-600 text-sm mb-6">
        {isAdvisorMode
          ? 'Prioritized next steps based on client priorities and circumstances.'
          : 'Prioritized next steps to move your planning forward.'}
      </p>

      {actions.recommendations.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Complete more discovery sections to generate action recommendations.
        </p>
      ) : (
        <div className="space-y-4">
          {actions.recommendations.map((action, index) => (
            <ActionCard key={action.id} action={action} isTopAction={index < 3} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ActionCardProps {
  action: ActionRecommendations['recommendations'][0];
  isTopAction: boolean;
}

function ActionCard({ action, isTopAction }: ActionCardProps): JSX.Element {
  const urgencyColor = {
    IMMEDIATE: 'bg-red-100 text-red-800',
    NEAR_TERM: 'bg-orange-100 text-orange-800',
    MEDIUM_TERM: 'bg-yellow-100 text-yellow-800',
    ONGOING: 'bg-blue-100 text-blue-800',
  }[action.urgency];

  const guidanceIcon = {
    SELF_GUIDED: '👤',
    ADVISOR_GUIDED: '👥',
    SPECIALIST_GUIDED: '🎓',
  }[action.guidance];

  return (
    <div
      className={`
        border rounded-lg p-4 transition-all
        ${isTopAction ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}
      `}
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <h4 className="font-medium text-gray-900">{action.title}</h4>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${urgencyColor}`}>
            {ACTION_URGENCY_LABELS[action.urgency]}
          </span>
          <span className="text-lg" title={ACTION_GUIDANCE_LABELS[action.guidance]}>
            {guidanceIcon}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{action.description}</p>

      <div className="bg-gray-50 rounded p-3 mb-3">
        <p className="text-sm text-gray-700">{action.rationale}</p>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
            {ACTION_TYPE_LABELS[action.type]}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
            {PLANNING_DOMAIN_LABELS[action.domain]}
          </span>
        </div>
        <span className="text-gray-500">
          {ACTION_GUIDANCE_LABELS[action.guidance]}
        </span>
      </div>
    </div>
  );
}

export default DiscoveryInsightsPanel;
