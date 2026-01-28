/**
 * Insights Page
 * Dedicated page for viewing planning insights with print functionality
 */

import { useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProfileStore } from '@/stores';
import { Button, LoadingSpinner } from '@/components/common';
import { DiscoveryInsightsPanel } from '@/components/discovery';
import {
  generateDiscoveryInsights,
  getInsightsStatusMessage,
  getMissingDataSuggestions,
} from '@/services/discoveryInsightsEngine';

export function InsightsPage(): JSX.Element {
  const { currentProfile, _hasHydrated } = useProfileStore();
  const printRef = useRef<HTMLDivElement>(null);

  // Generate discovery insights
  const discoveryInsights = useMemo(() => {
    if (!currentProfile) return null;
    return generateDiscoveryInsights({
      basicContext: currentProfile.basicContext,
      valuesDiscovery: currentProfile.valuesDiscovery,
      financialGoals: currentProfile.financialGoals,
      financialPurpose: currentProfile.financialPurpose,
    });
  }, [currentProfile]);

  const insightsStatusMessage = useMemo(() => {
    if (!currentProfile) return '';
    return getInsightsStatusMessage({
      basicContext: currentProfile.basicContext,
      valuesDiscovery: currentProfile.valuesDiscovery,
      financialGoals: currentProfile.financialGoals,
      financialPurpose: currentProfile.financialPurpose,
    });
  }, [currentProfile]);

  const missingSuggestions = useMemo(() => {
    if (!currentProfile) return [];
    return getMissingDataSuggestions({
      basicContext: currentProfile.basicContext,
      valuesDiscovery: currentProfile.valuesDiscovery,
      financialGoals: currentProfile.financialGoals,
      financialPurpose: currentProfile.financialPurpose,
    });
  }, [currentProfile]);

  // Print handler
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Show loading state while hydrating from localStorage
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your insights...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">No Profile Found</h1>
          <p className="mt-4 text-gray-600">
            You haven't started your discovery process yet.
          </p>
          <Link
            to="/consumer/discovery"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Start Discovery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-container { padding: 0 !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      <main className="mx-auto max-w-4xl px-4 py-8 print-container" ref={printRef}>
        {/* Header - hidden in print */}
        <header className="mb-8 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Planning Insights
              </h1>
              {currentProfile.basicContext?.firstName && (
                <p className="mt-1 text-gray-600">
                  Personalized insights for {currentProfile.basicContext.firstName}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/consumer/profile">
                <Button variant="secondary" fullWidth className="sm:w-auto">
                  View Full Profile
                </Button>
              </Link>
              <Button onClick={handlePrint} fullWidth className="sm:w-auto">
                Print Insights
              </Button>
            </div>
          </div>
        </header>

        {/* Print header - only visible in print */}
        <div className="hidden print:block mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Financial Planning Insights
          </h1>
          {currentProfile.basicContext?.firstName && (
            <p className="mt-1 text-gray-600">
              {currentProfile.basicContext.firstName} {currentProfile.basicContext.lastName}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Generated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Status message */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg no-print">
          <p className="text-blue-800">{insightsStatusMessage}</p>
        </div>

        {/* Missing data suggestions */}
        {missingSuggestions.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg no-print">
            <h3 className="text-sm font-medium text-amber-800 mb-2">
              Improve Your Insights
            </h3>
            <ul className="text-sm text-amber-700 space-y-1">
              {missingSuggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
            <Link
              to="/consumer/discovery"
              className="mt-3 inline-block text-sm font-medium text-amber-800 hover:text-amber-900 underline"
            >
              Continue Discovery →
            </Link>
          </div>
        )}

        {/* Main insights content */}
        {discoveryInsights ? (
          <DiscoveryInsightsPanel insights={discoveryInsights} />
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Not Enough Data Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Complete more discovery sections to generate personalized planning insights.
            </p>
            <Link to="/consumer/discovery">
              <Button>Continue Discovery</Button>
            </Link>
          </div>
        )}

        {/* Footer - hidden in print */}
        <footer className="mt-8 pt-6 border-t border-gray-200 no-print">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>
              Insights generated on {new Date().toLocaleDateString()} at{' '}
              {new Date().toLocaleTimeString()}
            </p>
            <Link
              to="/consumer/discovery"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Update Discovery Data →
            </Link>
          </div>
        </footer>

        {/* Print footer */}
        <footer className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <p>
            This document was generated by Pathfinder on {new Date().toLocaleDateString()}.
            These insights are for informational purposes only and do not constitute financial advice.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default InsightsPage;
