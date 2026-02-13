import { cn } from '@/lib/utils'

interface KanbanCardSkeletonProps {
  count?: number
  className?: string
}

export function KanbanCardSkeleton({
  count = 1,
  className,
}: KanbanCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-full h-fit bg-card border border-border/40 rounded-sm shadow-sm overflow-hidden',
            className,
          )}
        >
          <div className="p-4 py-2 space-y-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-6 rounded-full bg-muted-foreground/20 animate-pulse" />
              <div className="h-3 w-6 rounded-full bg-muted-foreground/20 animate-pulse" />
            </div>
            <div className="h-4 w-full bg-muted-foreground/20 rounded-sm animate-pulse" />
            <div className="h-4 w-2/3 bg-muted-foreground/20 rounded-sm animate-pulse" />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-12 rounded-md bg-muted-foreground/20 animate-pulse" />
                <div className="flex gap-2.5">
                  <div className="h-4 w-4 bg-muted-foreground/20 rounded-sm animate-pulse" />
                  <div className="h-4 w-4 bg-muted-foreground/20 rounded-sm animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
