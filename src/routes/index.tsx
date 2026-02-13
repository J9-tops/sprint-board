import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useWorkspaces } from '@/components/layout/WorkspaceContext'
import { useModalStore } from '@/stores/modals'
import { WorkspaceEmptyState } from '@/components/layout/WorkspaceEmptyState'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loading } from '@/components/ui/loading'

export const Route = createFileRoute('/')({
  loader: async () => {
    if (typeof window === 'undefined') return {}
    const { getWorkspaces: getWorkspacesService } =
      await import('@/services/workspace.service')
    const workspaces = await getWorkspacesService()
    if (workspaces.length === 1) {
      throw redirect({ to: `/${workspaces[0].slug}` as any })
    }
    return {}
  },
  component: RootPage,
})

function RootPage() {
  const { workspaces, activeWorkspace, isLoadingWorkspaces } = useWorkspaces()
  const { openModal } = useModalStore()
  const navigate = useNavigate()

  if (isLoadingWorkspaces) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading size="lg" text="Loading workspaces..." />
      </div>
    )
  }

  const handleCreateWorkspace = () => {
    openModal('create-workspace', {})
  }

  if (workspaces.length === 0) {
    return (
      <div className="flex-1 min-h-full bg-linear-to-br from-background via-background to-muted/30">
        <WorkspaceEmptyState onCreateWorkspace={handleCreateWorkspace} />
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-full bg-linear-to-br from-background via-background to-muted/30">
      <div className="p-4 md:p-8 lg:p-12 max-w-450 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <Button onClick={handleCreateWorkspace} size="sm">
            <Plus size={16} className="mr-2" />
            New Workspace
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              onClick={() => navigate({ to: `/${workspace.slug}` })}
              className={cn(
                'flex items-center gap-3 p-4 rounded-lg border-2 transition-all',
                'hover:border-primary/50 hover:shadow-md',
                activeWorkspace?.id === workspace.id
                  ? 'border-primary bg-accent'
                  : 'border-border bg-card',
              )}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: workspace.color }}
              />
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground">
                  {workspace.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {workspace.slug}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
