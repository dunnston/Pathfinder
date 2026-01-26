/**
 * Client Detail Page
 * Shows client info and provides access to their discovery/profile
 */

import { useParams, Link, Navigate } from 'react-router-dom';
import { useClientStore } from '@/stores';

export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { clients, selectClient } = useClientStore();

  const client = clients.find((c) => c.id === id);

  if (!client) {
    return <Navigate to="/advisor/clients" replace />;
  }

  // Select this client when viewing
  selectClient(client.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/advisor/clients"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Clients
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {client.firstName} {client.lastName}
              </h1>
              <div className="mt-2 flex gap-2">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  client.clientStatus === 'active'
                    ? 'bg-blue-100 text-blue-800'
                    : client.clientStatus === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {client.clientStatus}
                </span>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  client.profileStatus === 'complete'
                    ? 'bg-green-100 text-green-800'
                    : client.profileStatus === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  Profile: {client.profileStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Client Info */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Contact Info</h2>
            <dl className="mt-4 space-y-3">
              {client.email && (
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd className="text-gray-900">{client.email}</dd>
                </div>
              )}
              {client.phone && (
                <div>
                  <dt className="text-sm text-gray-500">Phone</dt>
                  <dd className="text-gray-900">{client.phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-500">Added</dt>
                <dd className="text-gray-900">
                  {new Date(client.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Link
                to={`/advisor/clients/${client.id}/discovery/basic-context`}
                className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
              >
                {client.profileStatus === 'not_started'
                  ? 'Start Discovery'
                  : client.profileStatus === 'in_progress'
                  ? 'Continue Discovery'
                  : 'Review Discovery'}
              </Link>
              <Link
                to={`/advisor/clients/${client.id}/profile`}
                className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-lg bg-white p-6 shadow lg:col-span-3">
            <h2 className="text-lg font-semibold text-gray-900">Advisor Notes</h2>
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
