import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { KanbanList } from './KanbanList'
import { DraggableCard } from './DraggableCard'
import type { ListData } from '@/types/board'

interface DraggableListProps {
  list: ListData
}

export function DraggableList({ list }: DraggableListProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: { type: 'list', listId: list.id },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SortableContext
        items={list.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <motion.div layout transition={{ duration: 0.3 }}>
          <KanbanList title={list.title} cardCount={list.cards.length}>
            {list.cards.map((card) => (
              <DraggableCard key={card.id} card={card} listId={list.id} />
            ))}
          </KanbanList>
        </motion.div>
      </SortableContext>
    </div>
  )
}
