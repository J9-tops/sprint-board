import { useState } from 'react'
import { BackgroundSelector } from './BackgroundSelector'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface CreateBoardModalProps {
  onClose: () => void
  onCreate: (data: { title: string; background: string }) => void
}

export function CreateBoardModalContent({
  onClose,
  onCreate,
}: CreateBoardModalProps) {
  const [title, setTitle] = useState('')
  const [background, setBackground] = useState(
    'bg-gradient-to-br from-purple-600 to-blue-600',
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onCreate({ title, background })
    setTitle('')
    onClose()
  }

  return (
    <div className="flex flex-col">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle>Create board</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <div className="px-6 space-y-6">
          {/* Preview & Input Combined */}
          <div
            className={cn(
              'w-full h-32 rounded-lg flex items-center justify-center p-8 transition-all duration-300 shadow-inner',
              background,
            )}
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Board title"
              className="bg-white/95 border-none shadow-xl h-11 font-medium placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:bg-white text-center"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Background
            </label>
            <BackgroundSelector
              selected={background}
              onSelect={setBackground}
            />
          </div>
        </div>

        <DialogFooter className="p-6 pt-8">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim()}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </div>
  )
}
