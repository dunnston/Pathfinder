/**
 * ProfileSectionCard Component
 * Collapsible card for displaying a profile section's data
 */

import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common';

interface ProfileSectionCardProps {
  title: string;
  icon?: React.ReactNode;
  isComplete: boolean;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  editLink?: string;
}

export function ProfileSectionCard({
  title,
  icon,
  isComplete,
  children,
  defaultExpanded = false,
  editLink,
}: ProfileSectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-blue-600">{icon}</span>}
          <span className="font-medium text-gray-900">{title}</span>
          {isComplete ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Complete
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
              Incomplete
            </span>
          )}
        </div>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 p-4">
          {children}
          {editLink && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                to={editLink}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Section
              </Link>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

/** Helper component for displaying a labeled value */
interface DataRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

// UX-19: Fix long text breaking layout with proper word-wrap
// SEC-10: Memoize to prevent unnecessary re-renders
export const DataRow = memo(function DataRow({ label, value, className = '' }: DataRowProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start py-2 ${className}`}>
      <dt className="text-sm font-medium text-gray-500 sm:w-48 sm:flex-shrink-0">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:flex-1 break-words overflow-wrap-anywhere min-w-0">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </dd>
    </div>
  );
})

/** Helper component for displaying a list of items */
interface DataListProps {
  label: string;
  items: string[];
}

// UX-19: Fix long text breaking layout
// SEC-10: Memoize to prevent unnecessary re-renders
export const DataList = memo(function DataList({ label, items }: DataListProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-2">
      <dt className="text-sm font-medium text-gray-500 sm:w-48 sm:flex-shrink-0">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:flex-1 break-words min-w-0">
        {items.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {items.map((item, index) => (
              <li key={index} className="break-words">{item}</li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-400 italic">None provided</span>
        )}
      </dd>
    </div>
  );
})

/** Helper component for displaying a ranked list */
interface RankedListProps {
  label: string;
  items: { rank: number; label: string }[];
}

// UX-19: Fix long text breaking layout
// SEC-10: Memoize to prevent unnecessary re-renders
export const RankedList = memo(function RankedList({ label, items }: RankedListProps) {
  const sortedItems = [...items].sort((a, b) => a.rank - b.rank);

  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-2">
      <dt className="text-sm font-medium text-gray-500 sm:w-48 sm:flex-shrink-0">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:flex-1 break-words min-w-0">
        {sortedItems.length > 0 ? (
          <ol className="list-decimal list-inside space-y-1">
            {sortedItems.map((item) => (
              <li key={item.rank} className="break-words">{item.label}</li>
            ))}
          </ol>
        ) : (
          <span className="text-gray-400 italic">None ranked</span>
        )}
      </dd>
    </div>
  );
})
