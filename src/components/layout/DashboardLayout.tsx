/**
 * Dashboard Layout
 * Wrapper component with sidebar navigation for dashboard pages
 */

import { type ReactNode, useState } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
  className?: string;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  headerActions,
  className = '',
}: DashboardLayoutProps): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

      {/* Mobile menu button - hidden when printing */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary print:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-dashboard-sidebar"
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

      {/* Desktop sidebar - always visible on md+, hidden when printing */}
      <div className="hidden md:block print:hidden">
        <DashboardNav className="fixed inset-y-0 left-0 z-30" />
      </div>

      {/* Mobile sidebar - hidden from focus/screen readers when closed, hidden when printing */}
      <div
        id="mobile-dashboard-sidebar"
        className={`md:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out print:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isMobileMenuOpen}
        // @ts-expect-error - inert is a valid HTML attribute but not yet in React types
        inert={!isMobileMenuOpen ? '' : undefined}
      >
        <DashboardNav onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main content area - full width when printing */}
      <div className="flex-1 md:ml-64 print:ml-0 flex flex-col">
        {/* Header */}
        {(title || headerActions) && (
          <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="pl-12 md:pl-0">
                {title && (
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
              {headerActions && (
                <div className="flex items-center gap-3">{headerActions}</div>
              )}
            </div>
          </header>
        )}

        {/* Page content */}
        <main className={`flex-1 ${className}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

interface DashboardPageProps {
  children: ReactNode;
  className?: string;
}

export function DashboardPage({
  children,
  className = '',
}: DashboardPageProps): JSX.Element {
  return (
    <div className={`p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}
