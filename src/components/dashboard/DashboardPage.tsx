import { Star, LayoutGrid, Home } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import { useTabs } from '../layout/TabsContext'
import { BoardSection } from './BoardSection'
import { BoardCard } from './BoardCard'
import { CreateBoardCard } from './CreateBoardCard'
import { CreateBoardModal } from './modal/CreateBoardModal'
import { STARRED_BOARDS, ALL_BOARDS } from '@/lib/mock-data'

export function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [starredBoards] = useState(STARRED_BOARDS)
  const [allBoards, setAllBoards] = useState(ALL_BOARDS)
  const { addTab } = useTabs()
  const location = useLocation()

  useEffect(() => {
    addTab({
      id: 'home',
      title: 'Home',
      path: location.pathname,
      icon: <Home size={13} />
    })
  }, [addTab, location.pathname])

  const handleCreateBoard = (data: { title: string; background: string }) => {
    const newBoard = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      background: data.background,
      label: 'PERSONAL',
    }
    setAllBoards([newBoard, ...allBoards])
  }

  return (
    <div className="flex-1 min-h-full bg-linear-to-br from-background via-background to-muted/30">
      <div className="p-4 md:p-8 lg:p-12 space-y-16 max-w-450 mx-auto">
        <BoardSection title="Starred Boards" icon={Star} iconColor="text-yellow-500">
          {starredBoards.map((board) => (
            <BoardCard key={board.id} {...board} starred />
          ))}
        </BoardSection>

        <BoardSection title="All Boards" icon={LayoutGrid} iconColor="text-primary" showSort>
          <div onClick={() => setIsCreateModalOpen(true)}>
            <CreateBoardCard />
          </div>
          {allBoards.map((board) => (
            <BoardCard key={board.id} {...board} />
          ))}
        </BoardSection>

        <CreateBoardModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateBoard}
        />
      </div>
    </div>
  )
}
