import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const workspaces = [
  { id: '1', name: 'Engineering', color: 'bg-purple-500' },
  { id: '2', name: 'Marketing', color: 'bg-orange-500' },
  { id: '3', name: 'Personal', color: 'bg-green-500' },
]

export function WorkspaceList() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-2 mb-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
          Workspaces
        </p>
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <Plus size={14} className="text-muted-foreground" />
        </Button>
      </div>
      {workspaces.map((ws) => (
        <Button
          key={ws.id}
          variant="ghost"
          className="justify-start gap-3 h-11 px-3 text-sm font-medium text-muted-foreground"
        >
          <div className={`w-2 h-2 rounded-full ${ws.color}`} />
          <span>{ws.name}</span>
        </Button>
      ))}
    </div>
  )
}
