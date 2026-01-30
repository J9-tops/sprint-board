import { CheckSquare, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'

export function CardChecklist() {
  const items = [
    { text: 'Review analytics', done: true },
    { text: 'Sketch wireframes', done: false },
    { text: 'High-fidelity mockup', done: false },
  ]

  return (
    <div className="flex items-start gap-4">
      <div className="mt-2 text-muted-foreground">
        <CheckSquare size={20} />
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-base tracking-tight text-foreground">
            Launch Requirements
          </h3>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 font-bold text-[10px] uppercase tracking-widest px-3 border-none bg-muted hover:bg-muted/80"
          >
            Delete
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 px-1">
            <span className="text-[10px] font-black text-muted-foreground w-8">
              33%
            </span>
            <Progress value={33} className="h-1.5 flex-1 bg-muted" />
          </div>

          <div className="space-y-0.5">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 group px-2 py-2.5 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border/50"
              >
                <Checkbox
                  checked={item.done}
                  className="h-5 w-5 rounded-md shadow-none data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span
                  className={`text-sm flex-1 ${item.done ? 'text-muted-foreground/60 line-through font-medium' : 'text-foreground font-bold tracking-tight'}`}
                >
                  {item.text}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal size={16} />
                </Button>
              </div>
            ))}
            <div className="px-1 pt-2">
              <Button
                variant="secondary"
                className="h-9 px-4 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-all rounded-lg"
              >
                Add an item
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
