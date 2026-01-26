/**
 * Profile Summary Page
 * Displays the completed Financial Decision Profile
 */

import { Link } from 'react-router-dom';
import { useProfileStore } from '@/stores';

export function ProfileSummary() {
  const { currentProfile } = useProfileStore();

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
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Financial Decision Profile
            </h1>
            <p className="mt-1 text-gray-600">
              Status: <span className="font-medium capitalize">{currentProfile.status.replace('_', ' ')}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/consumer/discovery/basic-context"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit Profile
            </Link>
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              Export JSON
            </button>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {/* Basic Context */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Basic Context</h2>
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              {currentProfile.basicContext ? (
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(currentProfile.basicContext, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 italic">Not completed</p>
              )}
            </div>
          </div>

          {/* Retirement Vision */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Retirement Vision</h2>
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              {currentProfile.retirementVision ? (
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(currentProfile.retirementVision, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 italic">Not completed</p>
              )}
            </div>
          </div>

          {/* Planning Preferences */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Planning Preferences</h2>
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              {currentProfile.planningPreferences ? (
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(currentProfile.planningPreferences, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 italic">Not completed</p>
              )}
            </div>
          </div>

          {/* Risk Comfort */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Risk & Income Comfort</h2>
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              {currentProfile.riskComfort ? (
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(currentProfile.riskComfort, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 italic">Not completed</p>
              )}
            </div>
          </div>

          {/* Financial Snapshot */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Financial Snapshot</h2>
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              {currentProfile.financialSnapshot ? (
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(currentProfile.financialSnapshot, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 italic">Not completed</p>
              )}
            </div>
          </div>

          {/* System Classifications */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">System Classifications</h2>
            <p className="mt-1 text-sm text-gray-500">Auto-generated from your responses</p>
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              {currentProfile.systemClassifications ? (
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(currentProfile.systemClassifications, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 italic">Will be calculated when profile is complete</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
