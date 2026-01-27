/**
 * Value Ranking Component
 * Drag-and-drop sortable list for ranking core values
 */

import { useEffect } from 'react'
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
import { VALUE_OPTIONS } from '@/data/planningPreferencesQuestions'
import type { ValueRanking as ValueRankingType, ValueType } from '@/types'

interface ValueRankingProps {
  value: ValueRankingType[]
  onChange: (values: ValueRankingType[]) => void
  error?: string
  isAdvisorMode?: boolean
}

interface SortableValueItemProps {
  id: ValueType
  valueType: ValueType
  rank: number
}

function SortableValueItem({ id, valueType, rank }: SortableValueItemProps): JSX.Element {
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

  const valueOption = VALUE_OPTIONS.find((v) => v.value === valueType)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 rounded-lg border bg-white
                  ${isDragging ? 'shadow-lg border-primary z-10' : 'border-gray-200'}
                  transition-shadow`}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="flex-shrink-0 p-2 -m-1 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Drag to reorder"
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
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${rank <= 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
      >
        {rank}
      </div>

      {/* Value info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900">{valueOption?.label || valueType}</div>
        <div className="text-sm text-gray-500 truncate">{valueOption?.description}</div>
      </div>

      {/* Top 3 indicator */}
      {rank <= 3 && (
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            Top {rank}
          </span>
        </div>
      )}
    </div>
  )
}

export function ValueRanking({
  value,
  onChange,
  error,
  isAdvisorMode = false,
}: ValueRankingProps): JSX.Element {
  // Initialize sensors first (hooks must be called unconditionally)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize with default values if empty - must be in useEffect to avoid setState during render
  useEffect(() => {
    if (value.length === 0) {
      const defaultValues = VALUE_OPTIONS.map((option, index) => ({
        value: option.value,
        rank: index + 1,
      }))
      onChange(defaultValues)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Show loading while initializing
  if (value.length === 0) {
    return <div className="animate-pulse text-gray-400">Loading values...</div>
  }

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((v) => v.value === active.id)
      const newIndex = value.findIndex((v) => v.value === over.id)

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
  const itemIds = value.map((v) => v.value)

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-2">
        {isAdvisorMode
          ? "Drag to reorder the client's core values from most important (1) to least important."
          : 'Drag to reorder your core values from most important (1) to least important.'}
      </div>

      {/* Top 3 indicator legend */}
      <div className="flex items-center gap-4 text-sm mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary"></div>
          <span className="text-gray-600">Top 3 values (highest priority)</span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {value.map((item) => (
              <SortableValueItem
                key={item.value}
                id={item.value}
                valueType={item.value}
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
