import { Link } from 'react-router-dom'
import { useClientStore } from '@/stores'
import { AdvisorLayout, AdvisorPage, ClientCard } from '@/components/layout'
import { Button } from '@/components/common'

export function AdvisorDashboard(): JSX.Element {
  const { clients } = useClientStore()

  const stats = {
    total: clients.length,
    inProgress: clients.filter((c) => c.status === 'active').length,
    completed: clients.filter((c) => c.status === 'completed').length,
    pending: clients.filter((c) => c.status === 'pending').length,
  }

  const recentClients = clients
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6)

  return (
    <AdvisorLayout
      title="Dashboard"
      subtitle="Welcome back! Here's an overview of your clients."
    >
      <AdvisorPage>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Clients"
            value={stats.total}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            color="warning"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Not Started"
            value={stats.pending}
            color="gray"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            color="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
            <Link to="/advisor/clients">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {recentClients.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </AdvisorPage>
    </AdvisorLayout>
  )
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color?: 'primary' | 'success' | 'warning' | 'gray'
}

function StatCard({ label, value, icon, color = 'primary' }: StatCardProps): JSX.Element {
  const colorStyles = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    gray: 'bg-gray-100 text-gray-500',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

function EmptyState(): JSX.Element {
  return (
    <div className="text-center py-12">
      <svg
        className="w-12 h-12 mx-auto text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No clients yet</h3>
      <p className="text-gray-500 mb-4">
        Get started by adding your first client
      </p>
      <Link to="/advisor/clients/new">
        <Button>Add Your First Client</Button>
      </Link>
    </div>
  )
}
