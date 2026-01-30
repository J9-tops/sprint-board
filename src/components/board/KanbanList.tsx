import { MoreHorizontal, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface KanbanListProps {
  title: string
  cardCount: number
  children: React.ReactNode
}

export function KanbanList({ title, cardCount, children }: KanbanListProps) {
  return (
    <article className="w-[320px] flex flex-col gap-4 shrink-0 bg-muted/30 rounded-2xl p-4 h-fit max-h-full border border-border/50 shadow-sm focus-within:ring-2 focus-within:ring-primary/10 outline-none transition-all">
      <div className="flex items-center justify-between px-1">
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

      <Button
        variant="ghost"
        className="justify-start gap-2 h-10 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 font-bold text-[11px] uppercase tracking-widest mt-1 group"
      >
        <Plus
          size={16}
          className="text-muted-foreground group-hover:text-primary transition-colors"
        />
        <span>Add another card</span>
      </Button>
    </article>
  )
}
