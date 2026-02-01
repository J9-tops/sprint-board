import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BoardEmptyStateProps {
  workspaceName: string
  onCreateBoard: () => void
}

export function BoardEmptyState({
  workspaceName,
  onCreateBoard,
}: BoardEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto space-y-8 px-6">
      <div className="space-y-4">
        <div className="bg-muted text-muted-foreground p-6 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto">
          <Plus size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">No Boards Yet</h2>
          <p className="text-muted-foreground text-sm font-medium">
            Create your first board in {workspaceName}
          </p>
        </div>
      </div>

      <Button
        onClick={onCreateBoard}
        size="lg"
        className="h-14 px-10 text-base font-bold uppercase tracking-widest"
      >
        Create Board
      </Button>
    </div>
  )
}
