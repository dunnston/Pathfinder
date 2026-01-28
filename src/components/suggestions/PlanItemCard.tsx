/**
 * Plan Item Card Component
 * Displays a single item in the user's plan with status management
 */

import { useState } from 'react';
import type { PlanItem, PlanItemStatus, SuggestionPriority } from '@/types/suggestions';
import { SUGGESTION_DOMAIN_LABELS, SUGGESTION_PRIORITY_LABELS, PLAN_ITEM_STATUS_LABELS } from '@/types/suggestions';
import { Button } from '@/components/common';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  PauseCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Edit3,
} from 'lucide-react';

interface PlanItemCardProps {
  /** The plan item to display */
  item: PlanItem;
  /** Called when status changes */
  onStatusChange: (itemId: string, status: PlanItemStatus, notes?: string) => void;
  /** Called when item is removed */
  onRemove: (itemId: string) => void;
  /** Called when item is edited */
  onEdit?: (itemId: string, updates: Partial<PlanItem>) => void;
  /** Whether to show drag handle */
  showDragHandle?: boolean;
  /** Whether card is in compact mode */
  compact?: boolean;
  /** Optional class name */
  className?: string;
}

const PRIORITY_STYLES: Record<SuggestionPriority, { badge: string; border: string }> = {
  HIGH: { badge: 'bg-red-100 text-red-700', border: 'border-l-red-500' },
  MEDIUM: { badge: 'bg-yellow-100 text-yellow-700', border: 'border-l-yellow-500' },
  LOW: { badge: 'bg-gray-100 text-gray-600', border: 'border-l-gray-400' },
};

const STATUS_STYLES: Record<PlanItemStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  planned: { bg: 'bg-gray-100', text: 'text-gray-600', icon: Clock },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', icon: PlayCircle },
  completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
  deferred: { bg: 'bg-amber-100', text: 'text-amber-700', icon: PauseCircle },
};

export function PlanItemCard({
  item,
  onStatusChange,
  onRemove,
  onEdit,
  showDragHandle = false,
  compact = false,
  className = '',
}: PlanItemCardProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDescription, setEditDescription] = useState(item.description);
  const [editNotes, setEditNotes] = useState(item.notes || '');

  const priorityStyle = PRIORITY_STYLES[item.priority];
  const statusStyle = STATUS_STYLES[item.status];
  const StatusIcon = statusStyle.icon;

  const handleStatusChange = (newStatus: PlanItemStatus) => {
    onStatusChange(item.id, newStatus);
    setShowStatusMenu(false);
  };

  const handleSaveEdit = () => {
    onEdit?.(item.id, {
      title: editTitle,
      description: editDescription,
      notes: editNotes,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditNotes(item.notes || '');
    setIsEditing(false);
  };

  return (
    <div
      className={`
        rounded-lg border bg-white shadow-sm transition-all border-l-4
        ${priorityStyle.border}
        ${item.status === 'completed' ? 'opacity-75' : ''}
        ${className}
      `}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          {showDragHandle && (
            <div className="cursor-grab text-gray-400 hover:text-gray-600">
              <GripVertical className="h-5 w-5" />
            </div>
          )}

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Top row with badges and actions */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {/* Domain badge */}
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {SUGGESTION_DOMAIN_LABELS[item.domain]}
              </span>

              {/* Priority badge */}
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${priorityStyle.badge}`}>
                {SUGGESTION_PRIORITY_LABELS[item.priority]}
              </span>

              {/* Status badge with dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {PLAN_ITEM_STATUS_LABELS[item.status]}
                  <ChevronDown className="h-3 w-3" />
                </button>

                {showStatusMenu && (
                  <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {(['planned', 'in_progress', 'completed', 'deferred'] as PlanItemStatus[]).map((status) => {
                      const style = STATUS_STYLES[status];
                      const Icon = style.icon;
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`
                            flex w-full items-center gap-2 px-3 py-2 text-left text-sm
                            ${item.status === status ? 'bg-gray-50' : 'hover:bg-gray-50'}
                          `}
                        >
                          <Icon className={`h-4 w-4 ${style.text}`} />
                          <span>{PLAN_ITEM_STATUS_LABELS[status]}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Source badge */}
              {item.type === 'custom' && (
                <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                  Custom
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
              <h4 className={`font-medium ${item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {item.title}
              </h4>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {onEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Edit"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onRemove(item.id)}
              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
              title="Remove from plan"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-3 pl-0">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={2}
                    placeholder="Add personal notes..."
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600">{item.description}</p>

                {/* Notes */}
                {item.notes && (
                  <div className="mt-3 rounded bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500">Notes</p>
                    <p className="mt-1 text-sm text-gray-600">{item.notes}</p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
                  {item.addedAt && (
                    <span>Added: {new Date(item.addedAt).toLocaleDateString()}</span>
                  )}
                  {item.startedAt && (
                    <span>Started: {new Date(item.startedAt).toLocaleDateString()}</span>
                  )}
                  {item.completedAt && (
                    <span>Completed: {new Date(item.completedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
