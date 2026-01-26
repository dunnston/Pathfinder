/**
 * Client Profile Page
 * Displays the client's Financial Decision Profile
 */

import { useParams, Link, Navigate } from 'react-router-dom';
import { useClientStore } from '@/stores';

export function ClientProfile() {
  const { id } = useParams<{ id: string }>();
  const { clients } = useClientStore();

  const client = clients.find((c) => c.id === id);

  if (!client) {
    return <Navigate to="/advisor/clients" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/advisor/clients/${id}`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to {client.firstName} {client.lastName}
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Financial Decision Profile
              </h1>
              <p className="mt-1 text-gray-600">
                {client.firstName} {client.lastName}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/advisor/clients/${id}/discovery/basic-context`}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit Profile
              </Link>
              <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                Export JSON
              </button>
            </div>
          </div>
        </div>

        {/* Profile status */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Profile Status</span>
              <span className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                client.profileStatus === 'complete'
                  ? 'bg-green-100 text-green-800'
                  : client.profileStatus === 'in_progress'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {client.profileStatus.replace('_', ' ')}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date(client.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Profile Sections - Placeholder */}
        <div className="space-y-6">
          {['Basic Context', 'Retirement Vision', 'Planning Preferences', 'Risk & Income Comfort', 'Financial Snapshot'].map(
            (section) => (
              <div key={section} className="rounded-lg bg-white p-6 shadow">
                <h2 className="text-xl font-semibold text-gray-900">{section}</h2>
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <p className="text-gray-500 italic">
                    Profile data will display here once discovery is complete
                  </p>
                </div>
              </div>
            )
          )}

          {/* System Classifications */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">System Classifications</h2>
            <p className="mt-1 text-sm text-gray-500">Auto-generated from client responses</p>
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <p className="text-gray-500 italic">
                Will be calculated when profile is complete
              </p>
            </div>
          </div>

          {/* Advisor Notes */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Advisor Notes</h2>
            <div className="mt-4">
              {client.notes ? (
                <p className="text-gray-700 whitespace-pre-wrap">{client.notes}</p>
              ) : (
                <p className="text-gray-500 italic">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
