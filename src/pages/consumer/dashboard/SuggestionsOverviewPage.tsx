/**
 * Suggestions Overview Page
 * Main entry point for the guided suggestions workflow
 * Shows all 8 domains with their exploration status
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DomainExplorer } from '@/components/suggestions';
import { useSuggestionsStore } from '@/stores/suggestionsStore';
import { SUGGESTION_DOMAINS } from '@/types/suggestions';
import { ClipboardList } from 'lucide-react';

export function SuggestionsOverviewPage() {
  const planItems = useSuggestionsStore((state) => state.planItems);
  const domainStates = useSuggestionsStore((state) => state.domainStates);

  // Compute total plannable items in useMemo to avoid infinite loops
  const totalPlannable = useMemo(() => {
    const planSourceIds = new Set(
      planItems.filter((p) => p.type === 'suggestion').map((p) => p.sourceId)
    );

    let acceptedNotInPlan = 0;
    for (const domain of SUGGESTION_DOMAINS) {
      const suggestions = domainStates[domain]?.suggestions || [];
      for (const s of suggestions) {
        if ((s.status === 'accepted' || s.status === 'modified') && !planSourceIds.has(s.id)) {
          acceptedNotInPlan++;
        }
      }
    }

    return planItems.length + acceptedNotInPlan;
  }, [planItems, domainStates]);

  return (
    <DashboardLayout
      title="Guided Suggestions"
      subtitle="Explore planning areas to receive personalized suggestions"
    >
      <div className="space-y-6">
        {/* Plan builder link if there are items */}
        {totalPlannable > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    You have {totalPlannable} item{totalPlannable !== 1 ? 's' : ''} ready for your plan
                  </p>
                  <p className="text-sm text-blue-700">
                    Review and organize your accepted suggestions
                  </p>
                </div>
              </div>
              <Link
                to="/consumer/dashboard/plan"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Build Your Plan
              </Link>
            </div>
          </div>
        )}

        {/* Domain Explorer */}
        <DomainExplorer />
      </div>
    </DashboardLayout>
  );
}
