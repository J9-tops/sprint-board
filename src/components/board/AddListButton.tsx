import { Plus } from 'lucide-react'

export function AddListButton() {
  return (
    <button className="w-72 shrink-0 bg-muted/30 hover:bg-muted/50 border-2 border-dashed border-border/50 rounded-xl p-3 flex items-center gap-2 transition-all group h-12">
      <div className="bg-muted group-hover:bg-primary group-hover:text-primary-foreground p-1 rounded-md transition-all">
        <Plus size={16} />
      </div>
      <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">
        Add another list
      </span>
    </button>
  )
}
