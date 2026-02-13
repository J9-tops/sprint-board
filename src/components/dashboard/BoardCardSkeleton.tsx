import { cn } from '@/lib/utils'

interface BoardCardSkeletonProps {
  count?: number
  className?: string
}

export function BoardCardSkeleton({
  count = 1,
  className,
}: BoardCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'relative h-44 rounded-2xl p-6 overflow-hidden',
            'border border-border/40 bg-muted/30',
            className,
          )}
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="h-6 w-3/4 bg-muted-foreground/20 rounded-md animate-pulse" />
            <div className="h-6 w-6 bg-muted-foreground/20 rounded-xl animate-pulse" />
          </div>
          <div className="absolute bottom-6 left-6 z-10">
            <div className="h-5 w-16 bg-muted-foreground/20 rounded-md animate-pulse" />
          </div>
        </div>
      ))}
    </>
  )
}
