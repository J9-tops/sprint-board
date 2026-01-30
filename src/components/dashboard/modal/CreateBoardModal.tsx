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
  const [background, setBackground] = useState('bg-blue-600')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onCreate({ title, background })
    setTitle('')
    onClose()
  }

  return (
    <>
      <div
        className={cn(
          'h-32 w-full flex items-center justify-center transition-all duration-500',
          background,
        )}
      >
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 shadow-xl border border-white/20">
          <div className="w-32 h-2 bg-white/40 rounded-full mb-2" />
          <div className="w-20 h-2 bg-white/20 rounded-full" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <DialogHeader className="px-0">
          <DialogTitle className="text-2xl font-black tracking-tight">
            Create Board
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="board-title"
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1"
            >
              {' '}
              Board Title{' '}
            </label>
            <Input
              id="board-title"
              placeholder="Enter board title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary font-semibold"
              autoFocus
            />
          </div>

          <BackgroundSelector selected={background} onSelect={setBackground} />
        </div>

        <DialogFooter className="px-0 pt-2">
          <Button
            type="submit"
            disabled={!title.trim()}
            className="w-full h-11 font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            Create Board
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
