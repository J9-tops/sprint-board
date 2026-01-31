import { DragOverlay } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { KanbanCard } from './KanbanCard'
import { KanbanList } from './KanbanList'
import { useBoardStore } from '@/stores/board'

interface BoardDragOverlayProps {
  activeId: string | null
}

export function BoardDragOverlay({ activeId }: BoardDragOverlayProps) {
  const boardData = useBoardStore((state) => state.boardData)

  const activeCard = boardData.lists
    .flatMap((l) => l.cards)
    .find((c) => c.id === activeId)
  const activeList = boardData.lists.find((l) => l.id === activeId)

  return (
    <DragOverlay>
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="shadow-2xl"
      >
        {activeCard && <KanbanCard {...activeCard} />}
        {activeList && (
          <KanbanList
            title={activeList.title}
            cardCount={activeList.cards.length}
          >
            {activeList.cards.map((card) => (
              <KanbanCard key={card.id} {...card} />
            ))}
          </KanbanList>
        )}
      </motion.div>
    </DragOverlay>
  )
}
