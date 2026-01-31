import { useRef, useState } from 'react'
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { DraggableList } from './DraggableList'
import { AddListButton } from './AddListButton'
import { useBoardStore } from '@/stores/board'
import { cn } from '@/lib/utils'

export function BoardListsContainer() {
  const boardData = useBoardStore((state) => state.boardData)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isScrollDragging, setIsScrollDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('.dnd-kit')) return

    setIsScrollDragging(true)
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft
    scrollLeft.current = scrollContainerRef.current.scrollLeft
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isScrollDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk
  }

  const onMouseUp = () => setIsScrollDragging(false)
  const onMouseLeave = () => setIsScrollDragging(false)

  return (
    <SortableContext
      items={boardData.lists.map((l) => l.id)}
      strategy={horizontalListSortingStrategy}
    >
      <div
        ref={scrollContainerRef}
        className={cn(
          'flex gap-6 h-full items-start min-w-max pb-4',
          isScrollDragging ? 'cursor-grabbing select-none' : 'cursor-grab',
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {boardData.lists.map((list) => (
          <DraggableList key={list.id} list={list} />
        ))}
        <AddListButton />
      </div>
    </SortableContext>
  )
}
