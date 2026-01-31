import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { KanbanCard } from './KanbanCard'
import type { CardData } from '@/types/board'

interface DraggableCardProps {
  card: CardData
  listId: string
}

export function DraggableCard({ card, listId }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'card', cardId: card.id, listId },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard {...card} />
    </motion.div>
  )
}
