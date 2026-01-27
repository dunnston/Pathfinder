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

interface RankingItem {
  id: string
  label: string
  description?: string
}

interface RankingListProps {
  items: RankingItem[]
  onReorder: (items: RankingItem[]) => void
  label?: string
  helperText?: string
  className?: string
}

interface SortableItemProps {
  item: RankingItem
  rank: number
}

function SortableItem({ item, rank }: SortableItemProps): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-white rounded-lg border-2 transition-colors ${
        isDragging
          ? 'border-primary shadow-lg z-10'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      {...attributes}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="flex-shrink-0 p-2 -m-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing touch-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={`Drag to reorder ${item.label}`}
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

      {/* Rank number */}
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
        {rank}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{item.label}</p>
        {item.description && (
          <p className="text-sm text-gray-500 truncate">{item.description}</p>
        )}
      </div>
    </div>
  )
}

export function RankingList({
  items,
  onReorder,
  label,
  helperText,
  className = '',
}: RankingListProps): JSX.Element {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      onReorder(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      )}
      {helperText && (
        <p className="text-sm text-gray-500 mb-3">{helperText}</p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2" role="list" aria-label={label}>
            {items.map((item, index) => (
              <SortableItem key={item.id} item={item} rank={index + 1} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
        Drag items to reorder by priority
      </p>
    </div>
  )
}
