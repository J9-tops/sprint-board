import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { BOARD_BACKGROUNDS } from '@/db'

interface CreateWorkspaceModalProps {
  onClose: () => void
  onCreate: (data: { name: string; color: string }) => void
  workspaceId?: string
  initialName?: string
  initialColor?: string
}

const WORKSPACE_COLORS = BOARD_BACKGROUNDS.SOLID

type WorkspaceColor = (typeof WORKSPACE_COLORS)[number]

export function CreateWorkspaceModalContent({
  onClose,
  onCreate,
  workspaceId,
  initialName,
  initialColor,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState(initialName || '')
  const initialColorValid = initialColor
    ? WORKSPACE_COLORS.includes(initialColor as WorkspaceColor)
    : false
  const [color, setColor] = useState<WorkspaceColor>(
    initialColorValid ? (initialColor as WorkspaceColor) : WORKSPACE_COLORS[0],
  )
  const isEditing = !!workspaceId

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreate({ name, color })
    setName('')
    setColor(WORKSPACE_COLORS[0])
    onClose()
  }

  return (
    <div className="flex flex-col">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle>
          {isEditing ? 'Edit workspace' : 'Create workspace'}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <div className="px-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Workspace name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Engineering, Marketing"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {WORKSPACE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-all hover:scale-110',
                    color === c &&
                      'ring-2 ring-foreground ring-offset-2 ring-offset-background',
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-8">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            {isEditing ? 'Save' : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </div>
  )
}
