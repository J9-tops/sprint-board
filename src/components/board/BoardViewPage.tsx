import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from '@tanstack/react-router'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Layout } from 'lucide-react'
import { useTabs } from '../layout/TabsContext'
import { BoardHeader } from './BoardHeader'
import { BoardListsContainer } from './BoardListsContainer'
import { BoardDragOverlay } from './BoardDragOverlay'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { useBoardStore } from '@/stores/board'
import { Loading } from '@/components/ui/loading'
import { getBoardOrThrow } from '@/db'

interface BoardViewPageProps {
  boardId?: string
}

export function BoardViewPage({
  boardId: propBoardId,
}: BoardViewPageProps = {}) {
  const { boardId: paramBoardId } = useParams({ from: '/board/$boardId' })
  const boardId = propBoardId || paramBoardId
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
  const [boardError, setBoardError] = useState<boolean>(false)
  const [overContainerId, setOverContainerId] = useState<string | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

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
        setBoardError(false)
      } catch (e) {
        console.error('Failed to load board info:', e)
        setBoardError(true)
      }
    }

    loadBoardInfo()
  }, [boardId])

  useEffect(() => {
    if (boardError || !boardTitle || boardTitle === 'Board') return

    addTab({
      id: boardId || 'board-view',
      title: boardTitle,
      path: location.pathname,
      icon: <Layout size={13} />,
    })
  }, [addTab, location.pathname, boardData, boardId, boardTitle])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    setOverContainerId(null)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const draggedId = active.id as string
    const overId = over.id as string

    const activeList = boardData.lists.find((l) =>
      l.cards.some((c) => c.id === draggedId),
    )

    if (!activeList) return

    const sourceListId = activeList.id

    const targetList = boardData.lists.find((l) => l.id === overId)
    if (targetList && overContainerId !== targetList.id) {
      setOverContainerId(targetList.id)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        reorderCards(sourceListId, draggedId, targetList.id, undefined)
      }, 30)
      return
    }

    const cardTargetList = boardData.lists.find((l) =>
      l.cards.some((c) => c.id === overId),
    )
    if (cardTargetList && overContainerId !== cardTargetList.id) {
      setOverContainerId(cardTargetList.id)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        reorderCards(sourceListId, draggedId, cardTargetList.id, overId)
      }, 30)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
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

      const targetList = boardData.lists.find((l) => l.id === overId)
      if (targetList) {
        await reorderCards(sourceListId, draggedId, targetList.id, undefined)
      } else {
        const cardTargetList = boardData.lists.find((l) =>
          l.cards.some((c) => c.id === overId),
        )
        if (cardTargetList) {
          await reorderCards(sourceListId, draggedId, cardTargetList.id, overId)
        }
      }
    } else {
      await reorderLists(draggedId, overId)
    }

    setActiveId(null)
    setOverContainerId(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading size="lg" text="Loading board..." />
      </div>
    )
  }

  if (boardError) {
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
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
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
