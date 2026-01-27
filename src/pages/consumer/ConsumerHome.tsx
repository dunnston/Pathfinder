/**
 * Consumer Home Page
 * Dashboard showing profile status and quick actions
 */

import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProfileStore } from '@/stores';
import { Card, Button } from '@/components/common';
import { calculateProfileCompleteness } from '@/services/classification';
import { DISCOVERY_SECTIONS } from '@/types';

export function ConsumerHome() {
  const navigate = useNavigate();
  const { currentProfile, resetProfile } = useProfileStore();

  // Calculate profile completeness
  const completeness = useMemo(() => {
    if (!currentProfile) return 0;
    return calculateProfileCompleteness(currentProfile);
  }, [currentProfile]);

  // Determine which section to resume from
  const resumeSection = useMemo(() => {
    if (!currentProfile) return 'basic-context';

    // Find first incomplete section
    const sections = ['basicContext', 'retirementVision', 'planningPreferences', 'riskComfort', 'financialSnapshot'] as const;
    for (const section of sections) {
      const data = currentProfile[section];
      if (!data || Object.keys(data).length === 0) {
        // Convert camelCase to slug
        return section.replace(/([A-Z])/g, '-$1').toLowerCase();
      }
    }
    return 'basic-context';
  }, [currentProfile]);

  const hasStarted = currentProfile && completeness > 0;
  const isComplete = completeness >= 80;

  const handleStartFresh = () => {
    if (confirm('This will clear your current progress. Are you sure?')) {
      resetProfile();
      navigate('/consumer/discovery/basic-context');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Pathfinder</h1>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Switch Mode
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {hasStarted ? 'Welcome Back!' : 'Welcome to Your Financial Journey'}
          </h2>
          <p className="text-gray-600 mb-6">
            {hasStarted
              ? 'Continue building your Financial Decision Profile to get personalized guidance.'
              : "Let's start by building your Financial Decision Profile. This helps us understand your situation, goals, and preferences."}
          </p>

          {/* Progress Bar */}
          {hasStarted && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                <span className="text-sm font-semibold text-gray-900">{completeness}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isComplete ? 'bg-green-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {hasStarted ? (
              <>
                {isComplete ? (
                  <Link to="/consumer/profile" className="flex-1">
                    <Button className="w-full">View Profile Summary</Button>
                  </Link>
                ) : (
                  <Link to={`/consumer/discovery/${resumeSection}`} className="flex-1">
                    <Button className="w-full">Continue Discovery</Button>
                  </Link>
                )}
                <Link to="/consumer/discovery" className="flex-1">
                  <Button variant="secondary" className="w-full">
                    View All Sections
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/consumer/discovery">
                <Button>Start Discovery</Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Section Progress */}
        {hasStarted && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Progress</h3>
            <div className="space-y-3">
              {DISCOVERY_SECTIONS.map((section) => {
                const sectionData = currentProfile?.[section.id as keyof typeof currentProfile];
                const isSectionComplete = sectionData && Object.keys(sectionData as object).length > 0;
                const slug = section.id.replace(/([A-Z])/g, '-$1').toLowerCase();

                return (
                  <Link
                    key={section.id}
                    to={`/consumer/discovery/${slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isSectionComplete
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {isSectionComplete ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          section.id === 'basicContext' ? '1' :
                          section.id === 'retirementVision' ? '2' :
                          section.id === 'planningPreferences' ? '3' :
                          section.id === 'riskComfort' ? '4' : '5'
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{section.title}</p>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>

            {/* Start Fresh Option */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleStartFresh}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Start Over (Clear Progress)
              </button>
            </div>
          </Card>
        )}

        {/* Quick Links for Complete Profiles */}
        {isComplete && (
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link to="/consumer/profile">
                <Button variant="secondary" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Full Profile
                </Button>
              </Link>
              <Link to="/consumer/discovery/basic-context">
                <Button variant="secondary" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Answers
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
