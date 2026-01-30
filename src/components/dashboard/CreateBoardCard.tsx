import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CreateBoardCard() {
  return (
    <div
      className={cn(
        'relative h-44 rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-300',
        'border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/30',
        'group flex flex-col items-center justify-center text-center',
      )}
      role="button"
      tabIndex={0}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4',
          'transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20',
        )}
      >
        <Plus
          size={28}
          className="text-muted-foreground group-hover:text-primary transition-colors"
        />
      </div>

      <h3
        className={cn(
          'font-bold text-lg text-foreground transition-colors duration-300',
          'group-hover:text-primary',
        )}
      >
        Create new board
      </h3>

      <p className="text-sm text-muted-foreground mt-1 max-w-[140px]">
        Add a new project workspace
      </p>

      <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}
