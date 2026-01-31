import {
  AlignLeft,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Paperclip,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface KanbanCardProps {
  title: string
  labels?: Array<{ name: string; color: string; type?: 'pill' | 'dot' }>
  dueDate?: {
    text: string
    status: 'overdue' | 'today' | 'normal' | 'completed'
  }
  checklist?: { total: number; completed: number }
  attachmentCount?: number
  hasDescription?: boolean
  coverImage?: string
  topBorderColor?: string
}

export function KanbanCard({
  title,
  labels,
  dueDate,
  checklist,
  attachmentCount,
  hasDescription,
  coverImage,
  topBorderColor,
}: KanbanCardProps) {
  return (
    <button className="w-full h-fit text-left group bg-card border border-border/40 rounded-sm shadow-sm hover:shadow-md hover:border-primary/40 transition-[box-shadow,border-color] duration-300 cursor-pointer overflow-hidden active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary outline-none relative [&::-webkit-scrollbar]:hidden">
      {topBorderColor && (
        <div
          className={cn('h-1.5 w-full absolute top-0 left-0', topBorderColor)}
        />
      )}
      {coverImage && (
        <div
          className={cn(
            'h-32 w-full overflow-hidden',
            topBorderColor && 'mt-1.5',
          )}
        >
          <img
            src={coverImage}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            aria-hidden="true"
          />
        </div>
      )}

      <div
        className={cn(
          'p-4 py-2 space-y-3',
          topBorderColor && !coverImage && 'pt-6',
        )}
      >
        {labels && labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {labels.map((l, i) =>
              l.type === 'pill' ? (
                <span
                  key={i}
                  className={cn(
                    'text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider text-white shadow-sm',
                    l.color,
                  )}
                >
                  {l.name}
                </span>
              ) : (
                <div
                  key={i}
                  className={cn('h-1 w-6 rounded-full shadow-xs', l.color)}
                  title={l.name}
                />
              ),
            )}
          </div>
        )}

        <h4 className="text-sm font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h4>

        {(dueDate || hasDescription || checklist || !!attachmentCount) && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground/70">
              {dueDate && (
                <div
                  className={cn(
                    'flex items-center gap-1.5 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.05em] shadow-sm',
                    dueDate.status === 'overdue'
                      ? 'bg-red-500 text-white'
                      : dueDate.status === 'today'
                        ? 'bg-blue-500 text-white'
                        : dueDate.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground border border-border/50',
                  )}
                >
                  {dueDate.status === 'completed' ? (
                    <CheckCircle2 size={10} strokeWidth={3} />
                  ) : (
                    <Calendar size={10} strokeWidth={3} />
                  )}
                  <span>{dueDate.text}</span>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                {hasDescription && (
                  <AlignLeft
                    size={13}
                    strokeWidth={2.5}
                    className="opacity-60"
                  />
                )}
                {checklist && (
                  <div
                    className={cn(
                      'flex items-center gap-1 text-[10px] font-bold',
                      checklist.completed === checklist.total
                        ? 'text-green-500'
                        : 'opacity-60',
                    )}
                  >
                    <CheckSquare size={13} strokeWidth={2.5} />
                    <span>
                      {checklist.completed}/{checklist.total}
                    </span>
                  </div>
                )}
                {attachmentCount && (
                  <div className="flex items-center gap-1 text-[10px] font-bold opacity-60">
                    <Paperclip size={13} strokeWidth={2.5} />
                    <span>{attachmentCount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </button>
  )
}
