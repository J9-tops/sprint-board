import { useEffect, useState } from 'react'
import {
  ArrowDownWideNarrow,
  ChevronRight,
  Filter,
  Home,
  Menu,
  Moon,
  Settings,
  Star,
  Sun,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useNavigate } from '@tanstack/react-router'
import { FilterPanel } from './FilterPanel'
import type { Board } from '@/db/types/entities'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useLayout } from '@/components/layout/LayoutContext'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { getBoards, getStarredBoards } from '@/services/board.service'

interface BoardHeaderProps {
  title: string
  isStarred?: boolean
}

export function BoardHeader({ title, isStarred }: BoardHeaderProps) {
  const { toggleSidebar } = useLayout()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [starredBoards, setStarredBoards] = useState<Array<Board>>([])
  const [allBoards, setAllBoards] = useState<Array<Board>>([])

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const [starred, all] = await Promise.all([
          getStarredBoards(),
          getBoards(),
        ])
        setStarredBoards(starred)
        setAllBoards(all)
      } catch (e) {
        console.error('Failed to load boards:', e)
      }
    }

    loadBoards()
  }, [])

  return (
    <div className="h-12 bg-background/95 backdrop-blur border-b flex items-center justify-between px-4 shrink-0 gap-4">
      <div className="flex items-center gap-2 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:bg-muted"
          onClick={toggleSidebar}
        >
          <Menu size={16} />
        </Button>

        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="flex items-center text-sm font-medium text-muted-foreground whitespace-nowrap hover:text-foreground transition-colors cursor-context-menu">
              <Home size={14} className="mr-1" />
              <span className="hidden sm:inline">Workspace</span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuLabel>Starred Boards</ContextMenuLabel>
            {starredBoards.map((board) => (
              <ContextMenuItem
                key={board.id}
                onClick={() => navigate({ to: `/board/${board.id}` })}
              >
                <span className="truncate">{board.name}</span>
              </ContextMenuItem>
            ))}
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>All Boards</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-56">
                {allBoards.map((board) => (
                  <ContextMenuItem
                    key={board.id}
                    onClick={() => navigate({ to: `/board/${board.id}` })}
                  >
                    <span className="truncate">{board.name}</span>
                  </ContextMenuItem>
                ))}
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>

        <ChevronRight size={14} className="text-muted-foreground/50 shrink-0" />

        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-foreground truncate">
            {title}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-6 w-6 shrink-0',
              isStarred
                ? 'text-yellow-500 hover:bg-yellow-500/10'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Star size={14} fill={isStarred ? 'currentColor' : 'none'} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </Button>

        <Separator orientation="vertical" className="h-4 mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Filter size={14} />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <FilterPanel />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowDownWideNarrow size={14} />
          <span className="hidden sm:inline">Sort</span>
        </Button>

        <Separator orientation="vertical" className="h-4 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Settings size={14} />
        </Button>
      </div>
    </div>
  )
}
