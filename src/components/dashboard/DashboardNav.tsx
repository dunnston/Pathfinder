/**
 * Dashboard Navigation Sidebar
 * Provides navigation between dashboard sections
 */

import { Link, useLocation } from 'react-router-dom';
import { useDashboardStore } from '@/stores';

interface DashboardNavProps {
  className?: string;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export function DashboardNav({ className = '', onClose }: DashboardNavProps): JSX.Element {
  const location = useLocation();
  const { trackedTasks, alerts } = useDashboardStore();

  // Count pending items for badges
  const pendingTasks = trackedTasks.filter(
    (t) => t.status === 'not_started' || t.status === 'in_progress'
  ).length;
  const activeAlerts = alerts.filter((a) => !a.completedAt && !a.acknowledgedAt).length;

  const navItems: NavItem[] = [
    {
      label: 'Overview',
      href: '/consumer/dashboard',
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
      badge: activeAlerts > 0 ? activeAlerts : undefined,
    },
    {
      label: 'My Profile',
      href: '/consumer/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      label: 'Planning Insights',
      href: '/consumer/insights',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      label: 'Focus Areas',
      href: '/consumer/dashboard/focus-areas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      label: 'Recommendations',
      href: '/consumer/dashboard/recommendations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      badge: pendingTasks > 0 ? pendingTasks : undefined,
    },
    {
      label: 'Investment Policy',
      href: '/consumer/dashboard/ips',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
          />
        </svg>
      ),
    },
    {
      label: 'Settings',
      href: '/consumer/dashboard/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const isActive = (href: string) => {
    if (href === '/consumer/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={`w-64 bg-white border-r border-gray-200 flex flex-col h-full ${className}`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/consumer/dashboard" className="flex items-center gap-2" onClick={handleNavClick}>
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
            <span className="block text-xs text-primary">Dashboard</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors min-h-[44px] ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span className="font-medium flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    active
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick links */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          to="/consumer/discovery"
          onClick={handleNavClick}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors min-h-[44px] px-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Continue Discovery
        </Link>
        <Link
          to="/consumer"
          onClick={handleNavClick}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors min-h-[44px] px-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </aside>
  );
}
