import { useEffect, useRef, useState } from 'react'
import {
  AlignLeft,
  Calendar,
  CheckCircle2,
  CheckSquare,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Input } from '@/components/ui/input'
import { useBoardStore } from '@/stores/board'

interface KanbanCardProps {
  id: string
  listId: string
  title: string
  labels?: Array<{ name: string; color: string; type?: 'pill' | 'dot' }>
  dueDate?: {
    text: string
    status: 'overdue' | 'today' | 'normal' | 'completed'
  }
  checklist?: { total: number; completed: number }
  attachmentCount?: number
  hasDescription?: boolean
  coverImage?: string
  topBorderColor?: string
}

export function KanbanCard({
  id,
  listId,
  title,
  labels,
  dueDate,
  checklist,
  attachmentCount,
  hasDescription,
  coverImage,
  topBorderColor,
}: KanbanCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const justStartedEditingRef = useRef(false)
  const updateCard = useBoardStore((state) => state.updateCard)
  const deleteCard = useBoardStore((state) => state.deleteCard)

  const handleEditTitle = () => {
    setEditedTitle(title)
    setIsEditingTitle(true)
    justStartedEditingRef.current = true

    // Allow blur to trigger after a short delay
    setTimeout(() => {
      justStartedEditingRef.current = false
    }, 200)
  }

  const handleSaveTitle = async () => {
    if (!editedTitle.trim()) return
    await updateCard(id, editedTitle)
    setIsEditingTitle(false)
    justStartedEditingRef.current = false
  }

  const handleBlur = () => {
    // Don't save if we just started editing (prevents context menu close from triggering save)
    if (justStartedEditingRef.current) return

    if (isEditingTitle) {
      handleSaveTitle()
    }
  }

  const handleCancelEditTitle = () => {
    setEditedTitle(title)
    setIsEditingTitle(false)
    justStartedEditingRef.current = false
  }

  const handleDeleteCard = async () => {
    await deleteCard(id, listId)
    setShowDeleteDialog(false)
  }

  // Sync edited title when not in edit mode
  useEffect(() => {
    if (!isEditingTitle) {
      setEditedTitle(title)
    }
  }, [title, isEditingTitle])

  // Focus on title input after context menu closes and state updates
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      // Small delay to ensure context menu has fully closed
      const timer = setTimeout(() => {
        titleInputRef.current?.focus()
        titleInputRef.current?.select()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isEditingTitle])

  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <div className="w-full h-fit text-left group bg-card border border-border/40 rounded-sm shadow-sm hover:shadow-md hover:border-primary/40 transition-[box-shadow,border-color] duration-300 overflow-hidden active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary outline-none relative [&::-webkit-scrollbar]:hidden">
        {topBorderColor && (
          <div
            className={cn('h-1.5 w-full absolute top-0 left-0', topBorderColor)}
          />
        )}
        {coverImage && (
          <div
            className={cn(
              'h-32 w-full overflow-hidden',
              topBorderColor && 'mt-1.5',
            )}
          >
            <img
              src={coverImage}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              aria-hidden="true"
            />
          </div>
        )}

        {!isEditingTitle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity focus-visible:ring-2 focus-visible:ring-primary outline-none"
                onClick={(e) => e.stopPropagation()}
                aria-label="Card actions"
              >
                <MoreHorizontal size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditTitle}>
                <Pencil size={14} className="mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 size={14} className="mr-2" />
                Delete Card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div
          className={cn(
            'p-4 py-2 space-y-3',
            topBorderColor && !coverImage && 'pt-6',
          )}
        >
          {labels && labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {labels.map((l, i) =>
                l.type === 'pill' ? (
                  <span
                    key={i}
                    className={cn(
                      'text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider text-white shadow-sm',
                      l.color,
                    )}
                  >
                    {l.name}
                  </span>
                ) : (
                  <div
                    key={i}
                    className={cn('h-1 w-6 rounded-full shadow-xs', l.color)}
                    title={l.name}
                  />
                ),
              )}
            </div>
          )}

          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle()
                if (e.key === 'Escape') handleCancelEditTitle()
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-bold leading-tight w-full h-auto py-2 px-4 bg-transparent border-0 focus-visible:ring-2 focus-visible:ring-primary outline-none"
              autoFocus
            />
          ) : (
            <h4 className="text-sm font-bold leading-tight text-foreground line-clamp-2">
              {title}
            </h4>
          )}

          {(dueDate || hasDescription || checklist || !!attachmentCount) && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground/70">
                {dueDate && (
                  <div
                    className={cn(
                      'flex items-center gap-1.5 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.05em] shadow-sm',
                      dueDate.status === 'overdue'
                        ? 'bg-red-500 text-white'
                        : dueDate.status === 'today'
                          ? 'bg-blue-500 text-white'
                          : dueDate.status === 'completed'
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground border border-border/50',
                    )}
                  >
                    {dueDate.status === 'completed' ? (
                      <CheckCircle2 size={10} strokeWidth={3} />
                    ) : (
                      <Calendar size={10} strokeWidth={3} />
                    )}
                    <span>{dueDate.text}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5">
                  {hasDescription && (
                    <AlignLeft
                      size={13}
                      strokeWidth={2.5}
                      className="opacity-60"
                    />
                  )}
                  {checklist && (
                    <div
                      className={cn(
                        'flex items-center gap-1 text-[10px] font-bold',
                        checklist.completed === checklist.total
                          ? 'text-green-500'
                          : 'opacity-60',
                      )}
                    >
                      <CheckSquare size={13} strokeWidth={2.5} />
                      <span>
                        {checklist.completed}/{checklist.total}
                      </span>
                    </div>
                  )}
                  {attachmentCount && (
                    <div className="flex items-center gap-1 text-[10px] font-bold opacity-60">
                      <Paperclip size={13} strokeWidth={2.5} />
                      <span>{attachmentCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Card</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this card? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteCard}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
