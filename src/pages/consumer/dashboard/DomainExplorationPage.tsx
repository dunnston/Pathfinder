/**
 * Domain Exploration Page
 * Guided question flow for a specific domain
 */

import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GuidedQuestionFlow } from '@/components/suggestions';
import { SUGGESTION_DOMAIN_LABELS, SUGGESTION_DOMAINS, type SuggestionDomain } from '@/types/suggestions';
import { ChevronLeft } from 'lucide-react';

export function DomainExplorationPage() {
  const { domain: domainParam } = useParams<{ domain: string }>();

  // Convert URL param to domain type (e.g., "income-plan" -> "INCOME_PLAN")
  const domainKey = domainParam?.toUpperCase().replace(/-/g, '_') as SuggestionDomain | undefined;

  // Validate domain
  const isValidDomain = domainKey && SUGGESTION_DOMAINS.includes(domainKey);

  if (!isValidDomain || !domainKey) {
    return (
      <DashboardLayout
        title="Domain Not Found"
        subtitle="The requested domain does not exist"
      >
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">Invalid domain: {domainParam}</p>
          <Link
            to="/consumer/dashboard/suggestions"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Suggestions
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const domainLabel = SUGGESTION_DOMAIN_LABELS[domainKey];

  return (
    <DashboardLayout
      title={domainLabel}
      subtitle="Answer questions to receive personalized suggestions"
    >
      <div className="space-y-6">
        {/* Back button */}
        <Link
          to="/consumer/dashboard/suggestions"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Suggestions
        </Link>

        {/* Guided Question Flow */}
        <GuidedQuestionFlow domain={domainKey} />
      </div>
    </DashboardLayout>
  );
}
