import { type ReactNode, useState } from 'react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-sidebar"
      >
        {isMobileMenuOpen ? (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Desktop sidebar - always visible and accessible on md+ */}
      <div className="hidden md:block">
        <AdvisorSidebar className="fixed inset-y-0 left-0 z-30" />
      </div>

      {/* Mobile sidebar - hidden from focus/screen readers when closed */}
      <div
        id="mobile-sidebar"
        className={`md:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isMobileMenuOpen}
        // @ts-expect-error - inert is a valid HTML attribute but not yet in React types
        inert={!isMobileMenuOpen ? '' : undefined}
      >
        <AdvisorSidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex-1 md:ml-64 flex flex-col">
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
    <div className={`p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  )
}
