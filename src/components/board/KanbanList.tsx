import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import { useBoardStore } from '@/stores/board'

interface KanbanListProps {
  title: string
  cardCount: number
  listId: string
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  children: React.ReactNode
}

export function KanbanList({
  title,
  cardCount,
  listId,
  dragHandleProps,
  children,
}: KanbanListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const addCard = useBoardStore((state) => state.addCard)
  const updateList = useBoardStore((state) => state.updateList)
  const deleteList = useBoardStore((state) => state.deleteList)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const justStartedEditingRef = useRef(false)

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCardTitle.trim()) return

    await addCard(listId, newCardTitle)
    setNewCardTitle('')
    setIsAddingCard(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAddingCard(false)
      setNewCardTitle('')
    }
  }

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
    await updateList(listId, editedTitle)
    setIsEditingTitle(false)
    justStartedEditingRef.current = false
  }

  const handleBlur = () => {
    // Don't save if we just started editing (prevents dropdown close from triggering save)
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

  const handleDeleteList = async () => {
    await deleteList(listId)
    setShowDeleteDialog(false)
  }

  // Sync edited title when not in edit mode
  useEffect(() => {
    if (!isEditingTitle) {
      setEditedTitle(title)
    }
  }, [title, isEditingTitle])

  // Focus on title input after dropdown closes and state updates
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      // Small delay to ensure dropdown has fully closed
      const timer = setTimeout(() => {
        titleInputRef.current?.focus()
        titleInputRef.current?.select()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isEditingTitle])

  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <article className="w-[320px] flex flex-col gap-4 shrink-0 bg-muted/30 rounded-2xl p-4 h-fit max-h-full border border-border/50 shadow-sm focus-within:ring-2 focus-within:ring-primary/10 outline-none transition-all">
        <div className="flex items-center justify-between px-1">
          <div
            className={`flex items-center gap-2 flex-1 ${!isEditingTitle ? 'cursor-grab active:cursor-grabbing' : ''}`}
            {...(!isEditingTitle ? dragHandleProps : {})}
          >
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
                className="h-7 px-2 py-1 text-sm font-bold uppercase tracking-widest"
              />
            ) : (
              <h3
                className="font-bold text-sm select-none uppercase tracking-widest text-foreground hover:bg-muted/50 rounded px-1 transition-colors cursor-pointer"
                onClick={handleEditTitle}
              >
                {title}
              </h3>
            )}
            <Badge
              variant="secondary"
              className="h-5 px-1.5 text-[10px] bg-muted-foreground/10 text-muted-foreground border-none select-none font-bold"
            >
              {cardCount}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary outline-none"
                aria-label={`List actions for ${title}`}
              >
                <MoreHorizontal size={18} />
              </Button>
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
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto min-h-0 pr-0.5 scrollbar-thin scrollbar-thumb-muted-foreground/10">
          {children}
        </div>

        {isAddingCard ? (
          <form onSubmit={handleAddCard} className="space-y-2">
            <Input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a title for this card..."
              className="h-10 bg-white shadow-lg resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="px-3">
                Add card
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingCard(false)
                  setNewCardTitle('')
                }}
              >
                <Plus size={16} className="rotate-45" />
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="ghost"
            className="justify-start gap-2 h-10 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 font-bold text-[11px] uppercase tracking-widest mt-1 group"
            onClick={() => setIsAddingCard(true)}
          >
            <Plus
              size={16}
              className="text-muted-foreground group-hover:text-primary transition-colors"
            />
            <span>Add another card</span>
          </Button>
        )}
      </article>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete List</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{title}"? This action cannot be
            undone and will permanently delete all cards in this list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteList}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
