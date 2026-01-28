/**
 * Suggestion Card Component
 * Displays a single suggestion with accept/reject/modify actions
 */

import { useState } from 'react';
import type { Suggestion } from '@/types/suggestions';
import {
  SUGGESTION_PRIORITY_LABELS,
  SUGGESTION_ACTION_TYPE_LABELS,
  SUGGESTION_STATUS_LABELS,
} from '@/types/suggestions';
import { Button } from '@/components/common';
import {
  CheckCircle2,
  XCircle,
  Edit3,
  ChevronDown,
  ChevronUp,
  Search,
  Eye,
  UserCheck,
} from 'lucide-react';

interface SuggestionCardProps {
  /** The suggestion to display */
  suggestion: Suggestion;
  /** Called when user accepts the suggestion */
  onAccept: (suggestionId: string, notes?: string) => void;
  /** Called when user rejects the suggestion */
  onReject: (suggestionId: string) => void;
  /** Called when user modifies the suggestion */
  onModify: (suggestionId: string, title: string, description: string) => void;
  /** Whether card is in compact mode */
  compact?: boolean;
  /** Optional class name */
  className?: string;
}

const PRIORITY_STYLES = {
  HIGH: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
  MEDIUM: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
  LOW: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600' },
};

const ACTION_TYPE_ICONS = {
  IMPLEMENT: CheckCircle2,
  INVESTIGATE: Search,
  MONITOR: Eye,
  CONSULT_PROFESSIONAL: UserCheck,
};

const STATUS_STYLES = {
  pending: { bg: 'bg-gray-100', text: 'text-gray-600' },
  accepted: { bg: 'bg-green-100', text: 'text-green-700' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700' },
  modified: { bg: 'bg-blue-100', text: 'text-blue-700' },
};

export function SuggestionCard({
  suggestion,
  onAccept,
  onReject,
  onModify,
  compact = false,
  className = '',
}: SuggestionCardProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(suggestion.modifiedTitle || suggestion.title);
  const [editDescription, setEditDescription] = useState(
    suggestion.modifiedDescription || suggestion.description
  );
  const [acceptNotes, setAcceptNotes] = useState('');
  const [showAcceptNotes, setShowAcceptNotes] = useState(false);

  const priorityStyle = PRIORITY_STYLES[suggestion.priority];
  const statusStyle = STATUS_STYLES[suggestion.status];
  const ActionIcon = ACTION_TYPE_ICONS[suggestion.actionType];

  const displayTitle = suggestion.modifiedTitle || suggestion.title;
  const displayDescription = suggestion.modifiedDescription || suggestion.description;

  const handleAccept = () => {
    onAccept(suggestion.id, acceptNotes || undefined);
    setShowAcceptNotes(false);
    setAcceptNotes('');
  };

  const handleSaveEdit = () => {
    onModify(suggestion.id, editTitle, editDescription);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(suggestion.modifiedTitle || suggestion.title);
    setEditDescription(suggestion.modifiedDescription || suggestion.description);
    setIsEditing(false);
  };

  return (
    <div
      className={`
        rounded-lg border transition-all
        ${priorityStyle.border} ${suggestion.status === 'pending' ? priorityStyle.bg : 'bg-white'}
        ${className}
      `}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Badges */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${priorityStyle.badge}`}>
                {SUGGESTION_PRIORITY_LABELS[suggestion.priority]}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                <ActionIcon className="h-3 w-3" />
                {SUGGESTION_ACTION_TYPE_LABELS[suggestion.actionType]}
              </span>
              {suggestion.status !== 'pending' && (
                <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                  {SUGGESTION_STATUS_LABELS[suggestion.status]}
                </span>
              )}
            </div>

            {/* Title */}
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 font-medium focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <h4 className="font-medium text-gray-900">{displayTitle}</h4>
            )}
          </div>

          {/* Expand/Collapse button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-3">
            {/* Description */}
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-sm text-gray-600">{displayDescription}</p>
            )}

            {/* Rationale */}
            <div className="mt-3 rounded bg-white/50 p-3">
              <p className="text-xs font-medium text-gray-500">Why this matters</p>
              <p className="mt-1 text-sm text-gray-600">{suggestion.rationale}</p>
            </div>

            {/* User notes if any */}
            {suggestion.userNotes && (
              <div className="mt-3 rounded bg-blue-50 p-3">
                <p className="text-xs font-medium text-blue-700">Your notes</p>
                <p className="mt-1 text-sm text-blue-600">{suggestion.userNotes}</p>
              </div>
            )}

            {/* Accept notes input */}
            {showAcceptNotes && suggestion.status === 'pending' && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">
                  Add notes (optional)
                </label>
                <textarea
                  value={acceptNotes}
                  onChange={(e) => setAcceptNotes(e.target.value)}
                  placeholder="Any notes about this suggestion..."
                  rows={2}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestion.status === 'pending' && !isEditing && (
                <>
                  {showAcceptNotes ? (
                    <>
                      <Button size="sm" onClick={handleAccept}>
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Confirm Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAcceptNotes(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => setShowAcceptNotes(true)}>
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="mr-1 h-4 w-4" />
                        Modify
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReject(suggestion.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                </>
              )}

              {isEditing && (
                <>
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save & Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </>
              )}

              {(suggestion.status === 'accepted' || suggestion.status === 'modified') && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Added to your plan
                </div>
              )}

              {suggestion.status === 'rejected' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAccept(suggestion.id)}
                >
                  Restore
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
