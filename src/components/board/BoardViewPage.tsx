import { useEffect, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { Layout } from 'lucide-react'
import { useTabs } from '../layout/TabsContext'
import { BoardHeader } from './BoardHeader'
import { BoardListsContainer } from './BoardListsContainer'
import { BoardDragOverlay } from './BoardDragOverlay'
import type { DragEndEvent } from '@dnd-kit/core'
import type { BoardData, CardData } from '@/types/board'
import { useBoardStore } from '@/stores/board'
import { BOARD_MOCK_DATA } from '@/lib/mock-data'

function convertMockToCardData(
  card: any,
  index: number,
  listId: string,
): CardData {
  return {
    id: `${listId}-card-${index}`,
    title: card.title,
    labels: card.labels,
    dueDate: card.dueDate,
    checklist: card.checklist,
    attachmentCount: card.attachmentCount,
    hasDescription: card.hasDescription,
    coverImage: card.coverImage,
    topBorderColor: card.color,
  }
}

function getInitialBoardData(): BoardData {
  return {
    version: '1.0.0',
    lists: [
      {
        id: 'backlog',
        title: 'Backlog',
        cards: BOARD_MOCK_DATA.backlog.map((card, i) =>
          convertMockToCardData(card, i, 'backlog'),
        ),
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        cards: BOARD_MOCK_DATA.inProgress.map((card, i) =>
          convertMockToCardData(card, i, 'in-progress'),
        ),
      },
      {
        id: 'review',
        title: 'Review',
        cards: BOARD_MOCK_DATA.review.map((card, i) =>
          convertMockToCardData(card, i, 'review'),
        ),
      },
      {
        id: 'done',
        title: 'Done',
        cards: BOARD_MOCK_DATA.done.map((card, i) =>
          convertMockToCardData(card, i, 'done'),
        ),
      },
    ],
  }
}

export function BoardViewPage() {
  const { addTab } = useTabs()
  const location = useLocation()
  const reorderCards = useBoardStore((state) => state.reorderCards)
  const reorderLists = useBoardStore((state) => state.reorderLists)
  const boardData = useBoardStore((state) => state.boardData)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    addTab({
      id: 'board-view',
      title: 'Product Roadmap 2024',
      path: location.pathname,
      icon: <Layout size={13} />,
    })

    useBoardStore.setState({ boardData: getInitialBoardData() })
  }, [addTab, location.pathname])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const draggedId = active.id as string
    const overId = over.id as string

    const activeList = boardData.lists.find((l) =>
      l.cards.some((c) => c.id === draggedId),
    )
    const isCard = !!activeList

    if (isCard) {
      const sourceListId = activeList.id
      const targetList = boardData.lists.find((l) =>
        l.cards.some((c) => c.id === overId),
      )
      if (targetList) {
        await reorderCards(sourceListId, draggedId, targetList.id, overId)
      }
    } else {
      await reorderLists(draggedId, overId)
    }

    setActiveId(null)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-muted/10">
      <BoardHeader title="Product Roadmap 2024" isStarred />
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto p-6 scrollbar-premium h-full">
          <BoardListsContainer />
        </div>
        <BoardDragOverlay activeId={activeId} />
      </DndContext>
    </div>
  )
}
