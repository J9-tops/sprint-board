import { useEffect, useState } from 'react'
import { LayoutGrid, Star } from 'lucide-react'
import { WorkspaceEmptyState } from '../layout/WorkspaceEmptyState'
import { useWorkspaces } from '../layout/WorkspaceContext'
import { BoardSection } from './BoardSection'
import { BoardCard } from './BoardCard'
import { CreateBoardCard } from './CreateBoardCard'
import { BoardEmptyState } from './BoardEmptyState'
import type { Board } from '@/db/types/entities'
import { useModalStore } from '@/stores/modals'
import { Loading } from '@/components/ui/loading'
import {
  createBoard,
  deleteBoard,
  getBoardsByWorkspace,
  getStarredBoards,
  toggleStar,
} from '@/services/board.service'

interface DashboardPageProps {
  workspaceSlug?: string
  workspaceId?: string
}

export function DashboardPage({
  workspaceSlug,
  workspaceId: propWorkspaceId,
}: DashboardPageProps = {}) {
  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    refreshWorkspaces,
    isLoadingWorkspaces,
  } = useWorkspaces()
  const [starredBoards, setStarredBoards] = useState<Array<Board>>([])
  const [allBoards, setAllBoards] = useState<Array<Board>>([])
  const [isLoading, setIsLoading] = useState(true)
  const { openModal, closeModal } = useModalStore()

  const workspaceId =
    propWorkspaceId ||
    (workspaceSlug
      ? workspaces.find((w) => w.slug === workspaceSlug)?.id
      : activeWorkspace?.id) ||
    null

  useEffect(() => {
    const loadBoards = async () => {
      if (!workspaceId) {
        // If we're still loading workspaces, don't stop loading yet
        if (!isLoadingWorkspaces) {
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      try {
        const [starred, workspaceBoards] = await Promise.all([
          getStarredBoards(),
          getBoardsByWorkspace(workspaceId),
        ])
        setStarredBoards(starred)
        setAllBoards(workspaceBoards)
      } catch (e) {
        console.error('Failed to load boards:', e)
      } finally {
        setIsLoading(false)
      }
    }

    loadBoards()
  }, [workspaceId, isLoadingWorkspaces])

  const handleCreateBoard = async (data: {
    title: string
    background: string
  }) => {
    const newBoard = await createBoard(
      data.title,
      data.background,
      '',
      workspaceId || null,
    )
    setAllBoards([newBoard, ...allBoards])
  }

  const handleToggleStar = async (boardId: string) => {
    try {
      const board = allBoards.find((b) => b.id === boardId)
      if (!board) return

      const newStarredState = !board.isStarred
      await toggleStar(boardId)

      if (newStarredState) {
        setStarredBoards([...starredBoards, board])
      } else {
        setStarredBoards(starredBoards.filter((b) => b.id !== boardId))
      }

      setAllBoards(
        allBoards.map((b) =>
          b.id === boardId ? { ...b, isStarred: newStarredState } : b,
        ),
      )
    } catch (e) {
      console.error('Failed to toggle star:', e)
    }
  }

  const handleDelete = async (boardId: string) => {
    try {
      await deleteBoard(boardId)
      setStarredBoards(starredBoards.filter((b) => b.id !== boardId))
      setAllBoards(allBoards.filter((b) => b.id !== boardId))
    } catch (e) {
      console.error('Failed to delete board:', e)
    }
  }

  if (isLoading || isLoadingWorkspaces) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading size="lg" text="Loading boards..." />
      </div>
    )
  }

  if (workspaces.length === 0) {
    return (
      <div className="flex-1 min-h-full bg-linear-to-br from-background via-background to-muted/30">
        <WorkspaceEmptyState
          onCreateWorkspace={() => {
            openModal('create-workspace', {
              onCreate: async (data: { name: string; color: string }) => {
                const { createWorkspaceService: createWs } =
                  await import('@/services/workspace.service')
                const newWorkspace = await createWs(data.name, data.color)
                setActiveWorkspace(newWorkspace.id)
                refreshWorkspaces()
                closeModal()
              },
            })
          }}
        />
      </div>
    )
  }

  if (allBoards.length === 0) {
    return (
      <div className="flex-1 min-h-full bg-linear-to-br from-background via-background to-muted/30">
        <BoardEmptyState
          workspaceName={activeWorkspace?.name || 'this workspace'}
          onCreateBoard={() =>
            openModal('create-board', { onCreate: handleCreateBoard })
          }
        />
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-full bg-linear-to-br from-background via-background to-muted/30">
      <div className="p-4 md:p-8 lg:p-12 space-y-16 max-w-450 mx-auto">
        {starredBoards.length > 0 && (
          <BoardSection
            title="Starred Boards"
            icon={Star}
            iconColor="text-yellow-500"
          >
            {starredBoards.map((board) => (
              <div key={board.id} className="relative">
                <BoardCard
                  id={board.id}
                  title={board.name}
                  background={board.background}
                  starred={board.isStarred}
                  onToggleStar={() => handleToggleStar(board.id)}
                  onDelete={() => handleDelete(board.id)}
                  workspaceSlug={workspaceSlug}
                />
              </div>
            ))}
          </BoardSection>
        )}

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
                onToggleStar={() => handleToggleStar(board.id)}
                onDelete={() => handleDelete(board.id)}
                workspaceSlug={workspaceSlug}
              />
            </div>
          ))}
        </BoardSection>
      </div>
    </div>
  )
}
