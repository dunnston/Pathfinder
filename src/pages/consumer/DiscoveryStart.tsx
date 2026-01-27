/**
 * Discovery Start Page
 * Entry point for the consumer discovery wizard
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore, useUIStore } from '@/stores';

export function DiscoveryStart() {
  const navigate = useNavigate();
  const { currentProfile, initializeProfile } = useProfileStore();
  const { startDiscovery, discoveryProgress } = useUIStore();

  useEffect(() => {
    // Initialize profile if needed
    if (!currentProfile) {
      initializeProfile('consumer-user');
    }

    // Start discovery if not already started
    if (!discoveryProgress) {
      startDiscovery();
    }
  }, [currentProfile, discoveryProgress, initializeProfile, startDiscovery]);

  const handleStartDiscovery = () => {
    navigate('/consumer/discovery/basic-context');
  };

  const handleResumeDiscovery = () => {
    if (discoveryProgress) {
      const sectionSlug = discoveryProgress.currentSection.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
      navigate(`/consumer/discovery/${sectionSlug}`);
    }
  };

  const hasExistingProgress = currentProfile?.status === 'in_progress';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Get Organized
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Let's build your Financial Decision Profile. This guided process helps
            capture who you are, what matters to you, and where you're headed.
          </p>
        </div>

        <div className="mt-12 rounded-lg bg-white p-8 shadow">
          <h2 className="text-xl font-semibold text-gray-900">
            What We'll Cover
          </h2>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                1
              </span>
              <div>
                <p className="font-medium text-gray-900">Basic Context</p>
                <p className="text-sm text-gray-500">Personal and employment information</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                2
              </span>
              <div>
                <p className="font-medium text-gray-900">Retirement Vision</p>
                <p className="text-sm text-gray-500">Goals, concerns, and priorities</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                3
              </span>
              <div>
                <p className="font-medium text-gray-900">Planning Preferences</p>
                <p className="text-sm text-gray-500">Decision-making style and values</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                4
              </span>
              <div>
                <p className="font-medium text-gray-900">Risk & Income Comfort</p>
                <p className="text-sm text-gray-500">Risk tolerance and income preferences</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                5
              </span>
              <div>
                <p className="font-medium text-gray-900">Financial Snapshot</p>
                <p className="text-sm text-gray-500">Overview of your financial situation</p>
              </div>
            </li>
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {hasExistingProgress ? (
              <>
                <button
                  onClick={handleResumeDiscovery}
                  className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Resume Where You Left Off
                </button>
                <button
                  onClick={handleStartDiscovery}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Start Fresh
                </button>
              </>
            ) : (
              <button
                onClick={handleStartDiscovery}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Begin Discovery
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
