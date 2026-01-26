import { useParams, useNavigate, Link } from 'react-router-dom'
import { useClientStore } from '@/stores'
import { AdvisorLayout, AdvisorPage } from '@/components/layout'
import { Button, Card, CardContent } from '@/components/common'
import { DISCOVERY_SECTIONS } from '@/types'

export function ClientDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getClient, updateClient } = useClientStore()

  const client = id ? getClient(id) : null

  if (!client) {
    return (
      <AdvisorLayout title="Client Not Found">
        <AdvisorPage>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Client not found
            </h2>
            <p className="text-gray-500 mb-4">
              The client you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/advisor/clients')}>
              Back to Clients
            </Button>
          </div>
        </AdvisorPage>
      </AdvisorLayout>
    )
  }

  const completionPercent = Math.round(client.profileCompletion * 100)

  const handleStartDiscovery = (): void => {
    if (client.status === 'pending') {
      updateClient(client.id, { status: 'active' })
    }
    navigate(`/advisor/clients/${client.id}/discovery/basic-context`)
  }

  return (
    <AdvisorLayout
      title={client.name}
      subtitle={client.email || 'No email provided'}
      headerActions={
        <div className="flex items-center gap-2">
          <Link to={`/advisor/clients/${client.id}/profile`}>
            <Button variant="secondary">View Profile</Button>
          </Link>
          <Button onClick={handleStartDiscovery}>
            {client.profileCompletion > 0 ? 'Continue Discovery' : 'Start Discovery'}
          </Button>
        </div>
      }
    >
      <AdvisorPage>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Discovery Progress
                </h3>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall completion</span>
                    <span className="text-sm font-medium text-gray-900">
                      {completionPercent}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>

                {/* Section progress */}
                <div className="space-y-3">
                  {DISCOVERY_SECTIONS.map((section) => {
                    const sectionProgress = client.sectionProgress[section.id] || 0
                    const isComplete = sectionProgress === 1
                    const isStarted = sectionProgress > 0
                    const slug = section.id.replace(/([A-Z])/g, '-$1').toLowerCase()

                    return (
                      <Link
                        key={section.id}
                        to={`/advisor/clients/${client.id}/discovery/${slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isComplete
                              ? 'bg-success text-white'
                              : isStarted
                                ? 'bg-primary/10 text-primary'
                                : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isComplete ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-sm font-medium">{section.order}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{section.title}</p>
                          <p className="text-sm text-gray-500">
                            {isComplete
                              ? 'Completed'
                              : isStarted
                                ? `${Math.round(sectionProgress * 100)}% complete`
                                : 'Not started'}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Client Information
                </h3>
                <dl className="space-y-3">
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
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd>
                      <StatusBadge status={client.status} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Created</dt>
                    <dd className="text-gray-900">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Advisor Notes */}
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Advisor Notes
                </h3>
                {client.advisorNotes ? (
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {client.advisorNotes}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">No notes added yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AdvisorPage>
    </AdvisorLayout>
  )
}

function StatusBadge({ status }: { status: string }): JSX.Element {
  const styles: Record<string, string> = {
    active: 'bg-warning/10 text-warning',
    pending: 'bg-gray-100 text-gray-600',
    completed: 'bg-success/10 text-success',
    archived: 'bg-gray-100 text-gray-500',
  }

  const labels: Record<string, string> = {
    active: 'In Progress',
    pending: 'Not Started',
    completed: 'Completed',
    archived: 'Archived',
  }

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  )
}
