import { FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WorkspaceEmptyStateProps {
  onCreateWorkspace: () => void
}

export function WorkspaceEmptyState({
  onCreateWorkspace,
}: WorkspaceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto space-y-8 px-6">
      <div className="space-y-4">
        <div className="bg-muted text-muted-foreground p-6 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto">
          <FolderPlus size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">No Workspace</h2>
          <p className="text-muted-foreground text-sm font-medium">
            Create your first workspace to start organizing your boards
          </p>
        </div>
      </div>

      <Button
        onClick={onCreateWorkspace}
        size="lg"
        className="h-14 px-10 text-base font-bold uppercase tracking-widest"
      >
        Create Workspace
      </Button>
    </div>
  )
}
