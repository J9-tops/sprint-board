import { Filter, KanbanSquare, X } from 'lucide-react'
import { SidebarMenu } from '@/components/layout/SidebarMenu'
import { WorkspaceList } from '@/components/layout/WorkspaceList'
import { StorageUsage } from '@/components/layout/StorageUsage'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-card flex flex-col h-screen transition-all duration-300 ease-in-out md:relative md:z-0 border-r',
          isOpen
            ? 'w-72 translate-x-0'
            : 'w-0 -translate-x-full md:translate-x-0 md:border-r-0',
        )}
      >
        <div
          className={cn(
            'flex flex-col h-full w-72 p-6 gap-8 transition-opacity duration-300',
            !isOpen && 'opacity-0 pointer-events-none md:hidden',
          )}
        >
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 px-2 rounded-lg outline-none">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                <KanbanSquare size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground select-none">
                TaskMaster
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 text-muted-foreground hover:bg-muted"
              onClick={onClose}
            >
              <X size={18} />
            </Button>
          </div>

          <div className="px-2 shrink-0">
            <div className="relative group">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                size={14}
              />
              <Input
                placeholder="Filter boards..."
                className="pl-9 h-9 bg-muted/50 border-none text-xs focus-visible:ring-2 focus-visible:ring-primary transition-all focus-visible:bg-background"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20">
            <SidebarMenu />
            <WorkspaceList />
          </div>

          <div className="shrink-0">
            <StorageUsage />
          </div>
        </div>
      </aside>
    </>
  )
}
