import { Link } from 'react-router-dom'
import type { Client } from '@/types'

interface ClientCardProps {
  client: Client
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusColor(status: Client['status']): string {
  switch (status) {
    case 'active':
      return 'bg-success/10 text-success'
    case 'pending':
      return 'bg-warning/10 text-warning'
    case 'completed':
      return 'bg-primary/10 text-primary'
    case 'archived':
      return 'bg-gray-100 text-gray-500'
    default:
      return 'bg-gray-100 text-gray-500'
  }
}

function getStatusLabel(status: Client['status']): string {
  switch (status) {
    case 'active':
      return 'In Progress'
    case 'pending':
      return 'Not Started'
    case 'completed':
      return 'Completed'
    case 'archived':
      return 'Archived'
    default:
      return status
  }
}

export function ClientCard({ client, className = '' }: ClientCardProps): JSX.Element {
  const completionPercent = Math.round(client.profileCompletion * 100)

  return (
    <Link
      to={`/advisor/clients/${client.id}`}
      className={`block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-semibold">
            {getInitials(client.name)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-gray-900 truncate">
                {client.name}
              </h3>
              {client.email && (
                <p className="text-sm text-gray-500 truncate">{client.email}</p>
              )}
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getStatusColor(client.status)}`}
            >
              {getStatusLabel(client.status)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Profile completion</span>
              <span className="font-medium text-gray-700">{completionPercent}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          {/* Last activity */}
          {client.updatedAt && (
            <p className="mt-2 text-xs text-gray-400">
              Last updated {new Date(client.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

interface ClientCardCompactProps {
  client: Client
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function ClientCardCompact({
  client,
  isSelected = false,
  onClick,
  className = '',
}: ClientCardCompactProps): JSX.Element {
  const completionPercent = Math.round(client.profileCompletion * 100)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-3 rounded-lg border text-left transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-transparent hover:bg-gray-50'
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-primary text-sm font-medium">
            {getInitials(client.name)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">
            {client.name}
          </p>
          <p className="text-xs text-gray-500">{completionPercent}% complete</p>
        </div>
      </div>
    </button>
  )
}
