/**
 * Domain Explorer Component
 * Displays all 8 suggestion domains with their exploration status
 */

import { useMemo } from 'react';
import type { SuggestionDomain } from '@/types/suggestions';
import { SUGGESTION_DOMAINS } from '@/types/suggestions';
import { useProfileStore } from '@/stores/profileStore';
import { useSuggestionsStore } from '@/stores/suggestionsStore';
import { getDomainRelevanceMap, getApplicableQuestions } from '@/services/suggestionsFilter';
import { getQuestionsByDomain, getAllDomains } from '@/data/suggestions';
import { DomainCard } from './DomainCard';

interface DomainExplorerProps {
  /** Optional class name */
  className?: string;
}

export function DomainExplorer({ className = '' }: DomainExplorerProps): JSX.Element {
  const profile = useProfileStore((state) => state.currentProfile);
  const domainStates = useSuggestionsStore((state) => state.domainStates);

  // Calculate relevance for each domain based on profile
  const relevanceMap = useMemo(() => {
    return getDomainRelevanceMap(profile);
  }, [profile]);

  // Get ordered domains (relevant first, then by default order)
  const orderedDomains = useMemo(() => {
    const domains = getAllDomains();

    // Sort: relevant domains first, then by order
    return domains.sort((a, b) => {
      const aRelevant = relevanceMap[a.id];
      const bRelevant = relevanceMap[b.id];

      if (aRelevant && !bRelevant) return -1;
      if (!aRelevant && bRelevant) return 1;
      return a.order - b.order;
    });
  }, [relevanceMap]);

  // Calculate question counts for each domain
  const questionCounts = useMemo(() => {
    const counts: Record<SuggestionDomain, { answered: number; total: number }> = {} as Record<
      SuggestionDomain,
      { answered: number; total: number }
    >;

    for (const domain of SUGGESTION_DOMAINS) {
      const allQuestions = getQuestionsByDomain(domain);
      const domainState = domainStates[domain];
      const applicableQuestions = getApplicableQuestions(
        allQuestions,
        profile,
        domainState.answers
      );

      const answeredIds = new Set(domainState.answers.map((a) => a.questionId));
      const answered = applicableQuestions.filter((q) => answeredIds.has(q.id)).length;

      counts[domain] = {
        answered,
        total: applicableQuestions.length,
      };
    }

    return counts;
  }, [profile, domainStates]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    for (const domain of SUGGESTION_DOMAINS) {
      const status = domainStates[domain].status;
      if (status === 'completed') completed++;
      else if (status === 'in_progress') inProgress++;
      else notStarted++;
    }

    return { completed, inProgress, notStarted, total: SUGGESTION_DOMAINS.length };
  }, [domainStates]);

  return (
    <div className={className}>
      {/* Overall progress summary */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Your Progress</h3>
            <p className="mt-1 text-sm text-gray-500">
              Explore each area to receive personalized suggestions
            </p>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-green-600">{overallProgress.completed}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-yellow-600">{overallProgress.inProgress}</div>
              <div className="text-xs text-gray-500">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-400">{overallProgress.notStarted}</div>
              <div className="text-xs text-gray-500">Not Started</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="flex h-full">
            <div
              className="bg-green-500 transition-all"
              style={{ width: `${(overallProgress.completed / overallProgress.total) * 100}%` }}
            />
            <div
              className="bg-yellow-500 transition-all"
              style={{ width: `${(overallProgress.inProgress / overallProgress.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Domain grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {orderedDomains.map((domainInfo) => {
          const domain = domainInfo.id;
          const domainState = domainStates[domain];
          const counts = questionCounts[domain];

          return (
            <DomainCard
              key={domain}
              domain={domain}
              status={domainState.status}
              isRelevant={relevanceMap[domain]}
              answeredCount={counts.answered}
              totalQuestions={counts.total}
              suggestionsCount={domainState.suggestions.length}
            />
          );
        })}
      </div>

      {/* Help text */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <h4 className="font-medium text-blue-900">How this works</h4>
        <ul className="mt-2 space-y-1 text-sm text-blue-700">
          <li>1. Select a domain to explore</li>
          <li>2. Answer guided questions (use external tools for analysis)</li>
          <li>3. Review generated suggestions</li>
          <li>4. Accept, modify, or add your own recommendations</li>
          <li>5. Build your personalized plan</li>
        </ul>
      </div>
    </div>
  );
}
