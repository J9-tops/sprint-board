import { useState } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

interface BoardCardProps {
  id: string
  title: string
  starred?: boolean
  background?: string
  label?: string
  labelColor?: string
  onToggleStar?: () => void
  onDelete?: () => void
}

export function BoardCard({
  id,
  title,
  starred,
  background,
  label,
  labelColor,
  onToggleStar,
  onDelete,
}: BoardCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleStar?.()
  }

  const handleDelete = () => {
    onDelete?.()
    setShowDeleteDialog(false)
  }

  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Link
            to="/board/$boardId"
            params={{ boardId: id }}
            className="block group outline-none"
          >
            <div
              className={cn(
                'relative h-44 rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-300',
                'group-hover:scale-[1.03] group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]',
                'group-active:scale-[0.98] group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2',
                'border border-white/10',
                background || 'bg-card shadow-sm',
              )}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />

              <div className="flex justify-between items-start relative z-10">
                <h3 className="font-extrabold text-xl text-white drop-shadow-md leading-tight group-hover:translate-y-[-2px] transition-transform duration-300">
                  {title}
                </h3>
                <button
                  onClick={handleStarClick}
                  className={cn(
                    'text-white/80 hover:text-white transition-all p-1.5 rounded-xl hover:bg-white/10 outline-none transform active:scale-90',
                    starred &&
                      'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]',
                  )}
                  aria-label={starred ? 'Unstar board' : 'Star board'}
                >
                  <Star
                    size={20}
                    fill={starred ? 'currentColor' : 'none'}
                    strokeWidth={starred ? 0 : 2}
                    className="transition-transform duration-300 group-hover:rotate-[15deg]"
                  />
                </button>
              </div>

              {label && (
                <div className="absolute bottom-6 left-6 z-10 transform transition-transform duration-300 group-hover:translate-y-[-2px]">
                  <Badge
                    className={cn(
                      'text-[10px] uppercase font-black tracking-[0.1em] px-2.5 py-1 border border-white/10 select-none shadow-sm',
                      labelColor || 'bg-black/30 text-white backdrop-blur-xl',
                    )}
                  >
                    {label}
                  </Badge>
                </div>
              )}

              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
          </Link>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem
            variant="destructive"
            onClick={(e) => {
              e.preventDefault()
              setShowDeleteDialog(true)
            }}
          >
            <Trash2 size={14} className="mr-2" />
            Delete Board
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Board</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{title}"? This action cannot be
            undone and will permanently delete all lists, cards, and data
            associated with this board.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
