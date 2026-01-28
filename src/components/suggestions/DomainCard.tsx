/**
 * Domain Card Component
 * Displays a single suggestion domain with status and progress
 */

import { useNavigate } from 'react-router-dom';
import type { SuggestionDomain, DomainExplorationStatus } from '@/types/suggestions';
import {
  SUGGESTION_DOMAIN_LABELS,
  SUGGESTION_DOMAIN_DESCRIPTIONS,
  SUGGESTION_DOMAIN_ICONS,
  DOMAIN_EXPLORATION_STATUS_LABELS,
} from '@/types/suggestions';
import {
  TrendingUp,
  PiggyBank,
  Shield,
  Wallet,
  Receipt,
  FileText,
  Umbrella,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
} from 'lucide-react';

interface DomainCardProps {
  /** The domain to display */
  domain: SuggestionDomain;
  /** Current exploration status */
  status: DomainExplorationStatus;
  /** Whether this domain is relevant for the user's profile */
  isRelevant: boolean;
  /** Number of questions answered */
  answeredCount: number;
  /** Total applicable questions */
  totalQuestions: number;
  /** Number of suggestions generated */
  suggestionsCount: number;
  /** Optional class name */
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  PiggyBank,
  Shield,
  Wallet,
  Receipt,
  FileText,
  Umbrella,
  Briefcase,
};

const STATUS_STYLES: Record<DomainExplorationStatus, { bg: string; text: string; icon: React.ReactNode }> = {
  not_started: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    icon: <Circle className="h-4 w-4" />,
  },
  in_progress: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
};

export function DomainCard({
  domain,
  status,
  isRelevant,
  answeredCount,
  totalQuestions,
  suggestionsCount,
  className = '',
}: DomainCardProps): JSX.Element {
  const navigate = useNavigate();

  const label = SUGGESTION_DOMAIN_LABELS[domain];
  const description = SUGGESTION_DOMAIN_DESCRIPTIONS[domain];
  const iconName = SUGGESTION_DOMAIN_ICONS[domain];
  const IconComponent = ICON_MAP[iconName] || TrendingUp;
  const statusStyle = STATUS_STYLES[status];

  const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleClick = () => {
    // Convert domain to URL slug (e.g., INCOME_PLAN -> income-plan)
    const slug = domain.toLowerCase().replace(/_/g, '-');
    navigate(`/consumer/dashboard/suggestions/${slug}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group relative w-full rounded-lg border bg-white p-5 text-left transition-all
        hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isRelevant ? 'border-gray-200' : 'border-gray-100 opacity-60'}
        ${className}
      `}
    >
      {/* Relevance indicator */}
      {!isRelevant && (
        <div className="absolute right-3 top-3">
          <span className="text-xs text-gray-400">Less relevant</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`
          flex h-12 w-12 shrink-0 items-center justify-center rounded-lg
          ${isRelevant ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}
        `}>
          <IconComponent className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{label}</h3>
            {/* Status badge */}
            <span className={`
              inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
              ${statusStyle.bg} ${statusStyle.text}
            `}>
              {statusStyle.icon}
              {DOMAIN_EXPLORATION_STATUS_LABELS[status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
        </div>

        {/* Arrow */}
        <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1" />
      </div>

      {/* Progress bar (only if started) */}
      {status !== 'not_started' && totalQuestions > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{answeredCount} of {totalQuestions} questions</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${
                status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Suggestions count (only if completed) */}
      {status === 'completed' && suggestionsCount > 0 && (
        <div className="mt-3 flex items-center gap-1 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>{suggestionsCount} suggestion{suggestionsCount !== 1 ? 's' : ''} generated</span>
        </div>
      )}
    </button>
  );
}
