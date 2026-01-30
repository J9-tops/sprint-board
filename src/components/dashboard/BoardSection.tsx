import type {  LucideIcon  } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BoardSectionProps {
  title: string
  icon: LucideIcon
  iconColor?: string
  children: React.ReactNode
  showSort?: boolean
}

export function BoardSection({
  title,
  icon: Icon,
  iconColor,
  children,
  showSort,
}: BoardSectionProps) {
  return (
    <section
      className="space-y-8"
      aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`p-2.5 rounded-xl bg-muted/50 border border-border/50 shadow-sm ${iconColor} select-none transform transition-transform group-hover:scale-110`}
          >
            <Icon size={22} />
          </div>
          <h2
            id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="font-extrabold text-2xl tracking-tight text-foreground"
          >
            {title}
          </h2>
        </div>
        {showSort && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground font-bold gap-2 hover:text-foreground hover:bg-muted/50 transition-all rounded-lg focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            Sort by: <span className="text-foreground">Most Recent</span>
            <ChevronDown size={14} />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {children}
      </div>
    </section>
  )
}
