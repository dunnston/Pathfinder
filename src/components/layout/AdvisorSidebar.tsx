import { Link, useLocation } from 'react-router-dom'
import { useClientStore } from '@/stores'
import { ClientCardCompact } from './ClientCard'

interface AdvisorSidebarProps {
  className?: string
  onClose?: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/advisor',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    label: 'All Clients',
    href: '/advisor/clients',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
]

export function AdvisorSidebar({ className = '', onClose }: AdvisorSidebarProps): JSX.Element {
  const location = useLocation()
  const { clients, selectedClientId, setSelectedClient } = useClientStore()
  const recentClients = clients.slice(0, 5)

  const handleNavClick = () => {
    // Close mobile menu when navigating
    if (onClose) {
      onClose()
    }
  }

  return (
    <aside
      className={`w-64 bg-white border-r border-gray-200 flex flex-col ${className}`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/advisor" className="flex items-center gap-2" onClick={handleNavClick}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <div>
            <span className="font-semibold text-gray-900">Pathfinder</span>
            <span className="block text-xs text-primary">Advisor</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors min-h-[44px] ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Add Client button */}
      <div className="px-4 py-2">
        <Link
          to="/advisor/clients/new"
          onClick={handleNavClick}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 min-h-[44px] bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="font-medium">Add Client</span>
        </Link>
      </div>

      {/* Recent clients */}
      {recentClients.length > 0 && (
        <div className="flex-1 overflow-y-auto border-t border-gray-100 mt-2">
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recent Clients
            </h3>
          </div>
          <div className="px-2">
            {recentClients.map((client) => (
              <ClientCardCompact
                key={client.id}
                client={client}
                isSelected={client.id === selectedClientId}
                onClick={() => {
                  setSelectedClient(client.id)
                  handleNavClick()
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mode switch */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/"
          onClick={handleNavClick}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors min-h-[44px] px-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          Switch to Consumer Mode
        </Link>
      </div>
    </aside>
  )
}
