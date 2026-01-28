/**
 * Custom Recommendation Form Component
 * Allows users to add their own recommendations outside the guided flow
 */

import { useState } from 'react';
import type { SuggestionDomain, SuggestionPriority } from '@/types/suggestions';
import { SUGGESTION_DOMAIN_LABELS, SUGGESTION_PRIORITY_LABELS, SUGGESTION_DOMAINS } from '@/types/suggestions';
import { Button } from '@/components/common';
import { Plus, X } from 'lucide-react';

interface CustomRecommendationFormProps {
  /** Called when form is submitted */
  onSubmit: (data: {
    domain: SuggestionDomain;
    title: string;
    description: string;
    priority: SuggestionPriority;
    createdBy: 'user' | 'advisor';
  }) => void;
  /** Called when form is cancelled */
  onCancel?: () => void;
  /** Default domain to select */
  defaultDomain?: SuggestionDomain;
  /** Whether this is being added by an advisor */
  isAdvisor?: boolean;
  /** Optional class name */
  className?: string;
}

export function CustomRecommendationForm({
  onSubmit,
  onCancel,
  defaultDomain,
  isAdvisor = false,
  className = '',
}: CustomRecommendationFormProps): JSX.Element {
  const [domain, setDomain] = useState<SuggestionDomain>(defaultDomain || 'INVESTMENTS');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<SuggestionPriority>('MEDIUM');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      domain,
      title: title.trim(),
      description: description.trim(),
      priority,
      createdBy: isAdvisor ? 'advisor' : 'user',
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setIsExpanded(false);
    onCancel?.();
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`
          flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed
          border-gray-300 p-4 text-gray-500 transition-colors
          hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600
          ${className}
        `}
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Add Custom Recommendation</span>
      </button>
    );
  }

  return (
    <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="font-medium text-gray-900">Add Custom Recommendation</h3>
        <button
          onClick={handleCancel}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Domain */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Domain</label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value as SuggestionDomain)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {SUGGESTION_DOMAINS.map((d) => (
              <option key={d} value={d}>
                {SUGGESTION_DOMAIN_LABELS[d]}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Review 401(k) allocation"
            maxLength={200}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what needs to be done and why..."
            rows={3}
            maxLength={1000}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <div className="mt-2 flex gap-3">
            {(['HIGH', 'MEDIUM', 'LOW'] as SuggestionPriority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`
                  flex-1 rounded-lg border-2 px-3 py-2 text-center text-sm font-medium transition-all
                  ${priority === p
                    ? p === 'HIGH'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : p === 'MEDIUM'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-500 bg-gray-50 text-gray-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                {SUGGESTION_PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim() || !description.trim()}>
            Add Recommendation
          </Button>
        </div>
      </form>
    </div>
  );
}
