import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBoardStore } from '@/stores/board'

export function AddListButton() {
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const addList = useBoardStore((state) => state.addList)

  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) return

    await addList(newListName)
    setNewListName('')
    setIsAddingList(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAddingList(false)
      setNewListName('')
    }
  }

  if (isAddingList) {
    return (
      <form
        onSubmit={handleAddList}
        className="w-72 shrink-0 bg-muted/30 rounded-2xl p-4 border border-border/50 shadow-sm"
      >
        <Input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter list title..."
          className="bg-white shadow-lg h-12"
          autoFocus
        />
        <div className="flex gap-2 mt-3">
          <Button type="submit" size="sm" className="px-4">
            Add list
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setIsAddingList(false)
              setNewListName('')
            }}
          >
            <X size={16} />
          </Button>
        </div>
      </form>
    )
  }

  return (
    <button
      onClick={() => setIsAddingList(true)}
      className="w-72 shrink-0 bg-muted/30 hover:bg-muted/50 border-2 border-dashed border-border/50 rounded-xl p-3 flex items-center gap-2 transition-all group h-12"
    >
      <div className="bg-muted group-hover:bg-primary group-hover:text-primary-foreground p-1 rounded-md transition-all">
        <Plus size={16} />
      </div>
      <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">
        Add another list
      </span>
    </button>
  )
}
