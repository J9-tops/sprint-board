import { useEffect, useState } from 'react'
import { LayoutGrid, Star } from 'lucide-react'
import { BoardSection } from './BoardSection'
import { BoardCard } from './BoardCard'
import { CreateBoardCard } from './CreateBoardCard'
import type { Board } from '@/db/types/entities'
import { useModalStore } from '@/stores/modals'
import {
  createBoard,
  getBoards,
  getStarredBoards,
  toggleStar,
} from '@/services/board.service'

export function DashboardPage() {
  const [starredBoards, setStarredBoards] = useState<Array<Board>>([])
  const [allBoards, setAllBoards] = useState<Array<Board>>([])
  const [isLoading, setIsLoading] = useState(true)
  const { openModal } = useModalStore()

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const [starred, all] = await Promise.all([
          getStarredBoards(),
          getBoards(),
        ])
        setStarredBoards(starred)
        setAllBoards(all)
      } catch (e) {
        console.error('Failed to load boards:', e)
      } finally {
        setIsLoading(false)
      }
    }

    loadBoards()
  }, [])

  const handleCreateBoard = async (data: {
    title: string
    background: string
  }) => {
    const newBoard = await createBoard(data.title, data.background)
    setAllBoards([newBoard, ...allBoards])
  }

  const handleToggleStar = async (boardId: string, currentStarred: boolean) => {
    try {
      await toggleStar(boardId)
      if (currentStarred) {
        setStarredBoards(starredBoards.filter((b) => b.id !== boardId))
      } else {
        const board = allBoards.find((b) => b.id === boardId)
        if (board) {
          setStarredBoards([...starredBoards, board])
        }
      }
      setAllBoards(
        allBoards.map((b) =>
          b.id === boardId ? { ...b, isStarred: !b.isStarred } : b,
        ),
      )
    } catch (e) {
      console.error('Failed to toggle star:', e)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading boards...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-full bg-linear-to-br from-background via-background to-muted/30">
      <div className="p-4 md:p-8 lg:p-12 space-y-16 max-w-450 mx-auto">
        <BoardSection
          title="Starred Boards"
          icon={Star}
          iconColor="text-yellow-500"
        >
          {starredBoards.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No starred boards yet
            </div>
          )}
          {starredBoards.map((board) => (
            <div key={board.id} className="relative">
              <BoardCard
                id={board.id}
                title={board.name}
                background={board.background}
                starred={board.isStarred}
                onToggleStar={() => handleToggleStar(board.id, board.isStarred)}
              />
            </div>
          ))}
        </BoardSection>

        <BoardSection
          title="All Boards"
          icon={LayoutGrid}
          iconColor="text-primary"
          showSort
        >
          <div
            onClick={() =>
              openModal('create-board', { onCreate: handleCreateBoard })
            }
          >
            <CreateBoardCard />
          </div>
          {allBoards.map((board) => (
            <div key={board.id} className="relative">
              <BoardCard
                id={board.id}
                title={board.name}
                background={board.background}
                starred={board.isStarred}
                onToggleStar={() => handleToggleStar(board.id, board.isStarred)}
              />
            </div>
          ))}
        </BoardSection>
      </div>
    </div>
  )
}
