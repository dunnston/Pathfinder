import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Client, ClientStatus } from '@/types'
import { ClientCard } from './ClientCard'
import { Button } from '@/components/common'

interface ClientListViewProps {
  clients: Client[]
  className?: string
}

type FilterStatus = ClientStatus | 'all'

export function ClientListView({
  clients,
  className = '',
}: ClientListViewProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: clients.length,
    active: clients.filter((c) => c.status === 'active').length,
    pending: clients.filter((c) => c.status === 'pending').length,
    completed: clients.filter((c) => c.status === 'completed').length,
    archived: clients.filter((c) => c.status === 'archived').length,
  }

  return (
    <div className={className}>
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Add Client button */}
        <Link to="/advisor/clients/new">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Client
          </Button>
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(
          [
            { value: 'all', label: 'All' },
            { value: 'active', label: 'In Progress' },
            { value: 'pending', label: 'Not Started' },
            { value: 'completed', label: 'Completed' },
            { value: 'archived', label: 'Archived' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.value
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                statusFilter === tab.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {statusCounts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Client list */}
      {filteredClients.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      ) : (
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
          <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first client'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link to="/advisor/clients/new">
              <Button>Add Your First Client</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
