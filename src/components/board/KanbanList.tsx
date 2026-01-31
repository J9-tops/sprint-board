import { useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useBoardStore } from '@/stores/board'

interface KanbanListProps {
  title: string
  cardCount: number
  listId: string
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  children: React.ReactNode
}

export function KanbanList({
  title,
  cardCount,
  listId,
  dragHandleProps,
  children,
}: KanbanListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const addCard = useBoardStore((state) => state.addCard)

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCardTitle.trim()) return

    await addCard(listId, newCardTitle)
    setNewCardTitle('')
    setIsAddingCard(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAddingCard(false)
      setNewCardTitle('')
    }
  }

  return (
    <article className="w-[320px] flex flex-col gap-4 shrink-0 bg-muted/30 rounded-2xl p-4 h-fit max-h-full border border-border/50 shadow-sm focus-within:ring-2 focus-within:ring-primary/10 outline-none transition-all">
      <div
        className="flex items-center justify-between px-1 cursor-grab active:cursor-grabbing"
        {...dragHandleProps}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm select-none uppercase tracking-widest text-foreground">
            {title}
          </h3>
          <Badge
            variant="secondary"
            className="h-5 px-1.5 text-[10px] bg-muted-foreground/10 text-muted-foreground border-none select-none font-bold"
          >
            {cardCount}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary outline-none"
          aria-label={`List actions for ${title}`}
        >
          <MoreHorizontal size={18} />
        </Button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto min-h-0 pr-0.5 scrollbar-thin scrollbar-thumb-muted-foreground/10">
        {children}
      </div>

      {isAddingCard ? (
        <form onSubmit={handleAddCard} className="space-y-2">
          <Input
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a title for this card..."
            className="h-10 bg-white shadow-lg resize-none"
            autoFocus
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="px-3">
              Add card
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAddingCard(false)
                setNewCardTitle('')
              }}
            >
              <Plus size={16} className="rotate-45" />
            </Button>
          </div>
        </form>
      ) : (
        <Button
          variant="ghost"
          className="justify-start gap-2 h-10 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 font-bold text-[11px] uppercase tracking-widest mt-1 group"
          onClick={() => setIsAddingCard(true)}
        >
          <Plus
            size={16}
            className="text-muted-foreground group-hover:text-primary transition-colors"
          />
          <span>Add another card</span>
        </Button>
      )}
    </article>
  )
}
