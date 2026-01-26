import { useParams, useNavigate, Link } from 'react-router-dom'
import { useClientStore } from '@/stores'
import { AdvisorLayout, AdvisorPage } from '@/components/layout'
import { Button, Card, CardContent } from '@/components/common'
import { DISCOVERY_SECTIONS } from '@/types'

export function ClientProfile(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getClient } = useClientStore()

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
  const isProfileComplete = client.status === 'completed'

  const handleExportJSON = (): void => {
    // Export profile as JSON
    const profileData = {
      clientName: client.name,
      exportedAt: new Date().toISOString(),
      status: client.status,
      completion: completionPercent,
      // Profile data will be added when discovery sections are implemented
    }
    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${client.name.replace(/\s+/g, '_')}_profile.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdvisorLayout
      title="Financial Decision Profile"
      subtitle={client.name}
      headerActions={
        <div className="flex items-center gap-2">
          <Link to={`/advisor/clients/${client.id}`}>
            <Button variant="ghost">Back to Client</Button>
          </Link>
          <Link to={`/advisor/clients/${client.id}/discovery/basic-context`}>
            <Button variant="secondary">Edit Profile</Button>
          </Link>
          <Button onClick={handleExportJSON}>Export JSON</Button>
        </div>
      }
    >
      <AdvisorPage>
        <div className="space-y-6">
          {/* Profile Status Overview */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Profile Status</span>
                    <div className="mt-1">
                      <ProfileStatusBadge status={client.status} />
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <span className="text-sm text-gray-500">Completion</span>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{completionPercent}%</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(client.updatedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Sections */}
          {DISCOVERY_SECTIONS.map((section) => {
            const sectionProgress = client.sectionProgress[section.id] || 0
            const isComplete = sectionProgress === 1
            const slug = section.id.replace(/([A-Z])/g, '-$1').toLowerCase()

            return (
              <Card key={section.id}>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                      {isComplete ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success">
                          Complete
                        </span>
                      ) : sectionProgress > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-warning/10 text-warning">
                          {Math.round(sectionProgress * 100)}% complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                          Not started
                        </span>
                      )}
                    </div>
                    <Link to={`/advisor/clients/${client.id}/discovery/${slug}`}>
                      <Button variant="ghost" size="sm">
                        {isComplete ? 'Edit' : 'Start'}
                      </Button>
                    </Link>
                  </div>

                  {isComplete ? (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-gray-500 italic">
                        Section data will be displayed here when profile store is connected
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                      <p className="text-gray-400">
                        Complete the discovery to see profile data
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {/* System Classifications */}
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">System Classifications</h2>
              <p className="text-sm text-gray-500 mb-4">Auto-generated from client responses</p>

              {isProfileComplete ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <ClassificationItem label="Planning Stage" value="Not calculated" />
                  <ClassificationItem label="Decision Urgency" value="Not calculated" />
                  <ClassificationItem label="Strategy Weight" value="Not calculated" />
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                  <p className="text-gray-400">
                    Classifications will be calculated when profile is complete
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advisor Notes */}
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Advisor Notes</h2>
              {client.advisorNotes ? (
                <p className="text-gray-600 whitespace-pre-wrap">{client.advisorNotes}</p>
              ) : (
                <p className="text-gray-400 italic">No notes added yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </AdvisorPage>
    </AdvisorLayout>
  )
}

function ProfileStatusBadge({ status }: { status: string }): JSX.Element {
  const styles: Record<string, string> = {
    active: 'bg-warning/10 text-warning',
    pending: 'bg-gray-100 text-gray-600',
    completed: 'bg-success/10 text-success',
    archived: 'bg-gray-100 text-gray-500',
  }

  const labels: Record<string, string> = {
    active: 'In Progress',
    pending: 'Not Started',
    completed: 'Complete',
    archived: 'Archived',
  }

  return (
    <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  )
}

function ClassificationItem({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 font-medium text-gray-900">{value}</dd>
    </div>
  )
}
