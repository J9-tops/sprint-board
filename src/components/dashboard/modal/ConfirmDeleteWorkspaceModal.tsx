import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ConfirmDeleteWorkspaceModalProps {
  onClose: () => void
  onConfirm: () => void
  workspaceName: string
}

export function ConfirmDeleteWorkspaceModal({
  onClose,
  onConfirm,
  workspaceName,
}: ConfirmDeleteWorkspaceModalProps) {
  return (
    <div className="flex flex-col">
      <DialogHeader className="p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="bg-destructive/10 p-3 rounded-full">
            <AlertTriangle size={24} className="text-destructive" />
          </div>
          <div className="space-y-1 flex-1">
            <DialogTitle className="text-left">Delete workspace</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{workspaceName}</strong>?
              All boards in this workspace will also be deleted. This action
              cannot be undone.
            </p>
          </div>
        </div>
      </DialogHeader>

      <DialogFooter className="p-6 pt-0">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="destructive" onClick={onConfirm}>
          Delete Workspace
        </Button>
      </DialogFooter>
    </div>
  )
}
