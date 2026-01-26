import type { ReactNode } from 'react'
import { AdvisorSidebar } from './AdvisorSidebar'
import { AdvisorHeader } from './Header'

interface AdvisorLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  headerActions?: ReactNode
  className?: string
}

export function AdvisorLayout({
  children,
  title,
  subtitle,
  headerActions,
  className = '',
}: AdvisorLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <AdvisorSidebar className="fixed inset-y-0 left-0 z-30" />

      {/* Main content area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        {(title || headerActions) && (
          <AdvisorHeader title={title} subtitle={subtitle} actions={headerActions} />
        )}

        {/* Page content */}
        <main className={`flex-1 ${className}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

interface AdvisorPageProps {
  children: ReactNode
  className?: string
}

export function AdvisorPage({
  children,
  className = '',
}: AdvisorPageProps): JSX.Element {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}
