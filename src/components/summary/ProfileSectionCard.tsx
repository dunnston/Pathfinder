/**
 * ProfileSectionCard Component
 * Collapsible card for displaying a profile section's data
 */

import { useState } from 'react';
import { Card } from '@/components/common';

interface ProfileSectionCardProps {
  title: string;
  icon?: React.ReactNode;
  isComplete: boolean;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function ProfileSectionCard({
  title,
  icon,
  isComplete,
  children,
  defaultExpanded = false,
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

export function DataRow({ label, value, className = '' }: DataRowProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start py-2 ${className}`}>
      <dt className="text-sm font-medium text-gray-500 sm:w-48 sm:flex-shrink-0">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </dd>
    </div>
  );
}

/** Helper component for displaying a list of items */
interface DataListProps {
  label: string;
  items: string[];
}

export function DataList({ label, items }: DataListProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-2">
      <dt className="text-sm font-medium text-gray-500 sm:w-48 sm:flex-shrink-0">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
        {items.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-400 italic">None provided</span>
        )}
      </dd>
    </div>
  );
}

/** Helper component for displaying a ranked list */
interface RankedListProps {
  label: string;
  items: { rank: number; label: string }[];
}

export function RankedList({ label, items }: RankedListProps) {
  const sortedItems = [...items].sort((a, b) => a.rank - b.rank);

  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-2">
      <dt className="text-sm font-medium text-gray-500 sm:w-48 sm:flex-shrink-0">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
        {sortedItems.length > 0 ? (
          <ol className="list-decimal list-inside space-y-1">
            {sortedItems.map((item) => (
              <li key={item.rank}>{item.label}</li>
            ))}
          </ol>
        ) : (
          <span className="text-gray-400 italic">None ranked</span>
        )}
      </dd>
    </div>
  );
}
