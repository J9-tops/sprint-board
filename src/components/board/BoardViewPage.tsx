import { useEffect, useState } from 'react'
import { useLocation, useParams } from '@tanstack/react-router'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { Layout } from 'lucide-react'
import { useTabs } from '../layout/TabsContext'
import { BoardHeader } from './BoardHeader'
import { BoardListsContainer } from './BoardListsContainer'
import { BoardDragOverlay } from './BoardDragOverlay'
import type { DragEndEvent } from '@dnd-kit/core'
import { useBoardStore } from '@/stores/board'
import { getBoardOrThrow } from '@/db'

export function BoardViewPage() {
  const { boardId } = useParams({ from: '/board/$boardId' })
  const { addTab } = useTabs()
  const location = useLocation()
  const reorderCards = useBoardStore((state) => state.reorderCards)
  const reorderLists = useBoardStore((state) => state.reorderLists)
  const boardData = useBoardStore((state) => state.boardData)
  const loadBoard = useBoardStore((state) => state.loadBoard)
  const isLoading = useBoardStore((state) => state.isLoading)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [boardTitle, setBoardTitle] = useState<string>('Board')
  const [isBoardStarred, setIsBoardStarred] = useState<boolean>(false)

  useEffect(() => {
    if (boardId) {
      loadBoard(boardId)
    }
  }, [boardId, loadBoard])

  useEffect(() => {
    const loadBoardInfo = async () => {
      if (!boardId) return
      try {
        const board = await getBoardOrThrow(boardId)
        setBoardTitle(board.name)
        setIsBoardStarred(board.isStarred)
      } catch (e) {
        console.error('Failed to load board info:', e)
      }
    }

    loadBoardInfo()
  }, [boardId])

  useEffect(() => {
    if (boardData.lists.length === 0) return

    addTab({
      id: boardId || 'board-view',
      title: boardTitle,
      path: location.pathname,
      icon: <Layout size={13} />,
    })
  }, [addTab, location.pathname, boardData, boardId, boardTitle])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading board...</div>
      </div>
    )
  }

  if (boardData.lists.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Board not found</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-muted/10">
      <BoardHeader title={boardTitle} isStarred={isBoardStarred} />
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
