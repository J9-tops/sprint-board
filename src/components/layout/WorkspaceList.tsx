import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useWorkspaces } from './WorkspaceContext'
import { useTabs } from './TabsContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/stores/modals'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function WorkspaceList() {
  const {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspace,
    refreshWorkspaces,
  } = useWorkspaces()
  const { openModal, closeModal } = useModalStore()
  const { tabs, closeTab } = useTabs()
  const location = useLocation()
  const navigate = useNavigate()

  const handleCreateWorkspace = () => {
    openModal('create-workspace', {
      onCreate: async (data: { name: string; color: string }) => {
        const { createWorkspaceService: createWs } =
          await import('@/services/workspace.service')
        const newWorkspace = await createWs(data.name, data.color)
        setActiveWorkspace(newWorkspace.id)
        refreshWorkspaces()
        navigate({ to: `/${newWorkspace.slug}` })
        closeModal()
      },
    })
  }

  const handleUpdateWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find((ws) => ws.id === workspaceId)
    if (!workspace) return

    openModal('create-workspace', {
      workspaceId,
      initialName: workspace.name,
      initialColor: workspace.color,
      onCreate: async (data: { name: string; color: string }) => {
        const { updateWorkspaceService: updateWs } =
          await import('@/services/workspace.service')
        await updateWs(workspaceId, { name: data.name, color: data.color })
        refreshWorkspaces()
        closeModal()
      },
    })
  }

  const handleDeleteWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find((ws) => ws.id === workspaceId)
    if (!workspace) return

    openModal('confirm-delete-workspace', {
      workspaceName: workspace.name,
      onConfirm: async () => {
        const { deleteWorkspaceService: deleteWs } =
          await import('@/services/workspace.service')
        await deleteWs(workspaceId)

        if (activeWorkspaceId === workspaceId) {
          setActiveWorkspace(null)

          const remainingWorkspaces = workspaces.filter(
            (ws) => ws.id !== workspaceId,
          )
          if (remainingWorkspaces.length > 0) {
            navigate({ to: `/${remainingWorkspaces[0].slug}` })
          } else {
            navigate({ to: '/' })
          }
        }

        // Close board tab if currently viewing a board (which may belong to deleted workspace)
        if (
          location.pathname.startsWith('/board/') ||
          location.pathname.match(/^\/[^/]+\/[^/]+$/)
        ) {
          const boardTab = tabs.find((t) => t.path === location.pathname)
          if (boardTab) {
            closeTab(boardTab.id)
          }
        }

        refreshWorkspaces()
        closeModal()
      },
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-2 mb-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
          Workspaces
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={handleCreateWorkspace}
        >
          <Plus size={14} className="text-muted-foreground" />
        </Button>
      </div>
      {workspaces.map((ws) => (
        <div key={ws.id} className="flex items-center group">
          <Button
            variant="ghost"
            className={cn(
              'justify-start gap-3 h-11 px-3 text-sm font-medium flex-1',
              activeWorkspaceId === ws.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => navigate({ to: `/${ws.slug}` })}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: ws.color }}
            />
            <span className="flex-1 text-left">{ws.name}</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleUpdateWorkspace(ws.id)}>
                <Pencil size={14} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeleteWorkspace(ws.id)}
              >
                <Trash2 size={14} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  )
}
