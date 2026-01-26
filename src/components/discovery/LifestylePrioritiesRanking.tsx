/**
 * Lifestyle Priorities Ranking Component
 * Drag-and-drop sortable list for ranking retirement lifestyle priorities
 */

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DEFAULT_LIFESTYLE_PRIORITIES } from '@/data/retirementVisionQuestions'
import type { LifestylePriority } from '@/types'

interface LifestylePrioritiesRankingProps {
  value: LifestylePriority[]
  onChange: (priorities: LifestylePriority[]) => void
  error?: string
  isAdvisorMode?: boolean
}

interface SortableItemProps {
  id: string
  priority: string
  rank: number
}

function SortableItem({ id, priority, rank }: SortableItemProps): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border bg-white
                  ${isDragging ? 'shadow-lg border-primary z-10' : 'border-gray-200'}
                  transition-shadow`}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="flex-shrink-0 p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </button>

      {/* Rank badge */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium
                    ${rank <= 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
      >
        {rank}
      </div>

      {/* Priority text */}
      <span className="flex-1 text-gray-900">{priority}</span>
    </div>
  )
}

export function LifestylePrioritiesRanking({
  value,
  onChange,
  error,
  isAdvisorMode = false,
}: LifestylePrioritiesRankingProps): JSX.Element {
  // Initialize with default priorities if empty
  const [initialized, setInitialized] = useState(false)

  if (!initialized && value.length === 0) {
    const defaultPriorities = DEFAULT_LIFESTYLE_PRIORITIES.map((priority, index) => ({
      priority,
      rank: index + 1,
    }))
    onChange(defaultPriorities)
    setInitialized(true)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((p) => p.priority === active.id)
      const newIndex = value.findIndex((p) => p.priority === over.id)

      const newArray = arrayMove(value, oldIndex, newIndex)
      // Update ranks after reordering
      const updatedArray = newArray.map((item, index) => ({
        ...item,
        rank: index + 1,
      }))
      onChange(updatedArray)
    }
  }

  // Get item IDs for sortable context
  const itemIds = value.map((p) => p.priority)

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-2">
        {isAdvisorMode
          ? "Drag to reorder the client's lifestyle priorities from most important (1) to least important."
          : 'Drag to reorder your lifestyle priorities from most important (1) to least important.'}
      </div>

      {/* Top 3 indicator */}
      <div className="flex items-center gap-2 text-sm">
        <div className="w-4 h-4 rounded-full bg-primary"></div>
        <span className="text-gray-600">Top 3 priorities</span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {value.map((item) => (
              <SortableItem
                key={item.priority}
                id={item.priority}
                priority={item.priority}
                rank={item.rank}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Error message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* Keyboard instructions */}
      <p className="text-xs text-gray-400 mt-4">
        Tip: Use keyboard to reorder - Tab to select, Space to pick up, Arrow keys to move, Space to drop.
      </p>
    </div>
  )
}
