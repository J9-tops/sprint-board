import { useEffect, useRef, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import { Layout } from 'lucide-react'
import { useTabs } from '../layout/TabsContext'
import { BoardHeader } from './BoardHeader'
import { KanbanList } from './KanbanList'
import { KanbanCard } from './KanbanCard'
import { useModalStore } from '@/stores/modals'
import { BOARD_MOCK_DATA } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function BoardViewPage() {
  const { addTab } = useTabs()
  const { openModal } = useModalStore()
  const location = useLocation()

  useEffect(() => {
    addTab({
      id: 'board-view',
      title: 'Product Roadmap 2024',
      path: location.pathname,
      icon: <Layout size={13} />,
    })
  }, [addTab, location.pathname])

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('.group')) return

    setIsDragging(true)
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft
    scrollLeft.current = scrollContainerRef.current.scrollLeft
  }

  const onMouseLeave = () => {
    setIsDragging(false)
  }

  const onMouseUp = () => {
    setIsDragging(false)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk
  }

  const openCardModal = (title: string) => {
    openModal('card-detail', {
      card: {
        title,
        labels: [{ name: 'FEATURE', color: 'bg-emerald-500' }],
        dueDate: 'Oct 12, 2024',
      },
    })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-muted/10">
      <BoardHeader title="Product Roadmap 2024" isStarred />

      <div
        ref={scrollContainerRef}
        className={cn(
          'flex-1 overflow-x-auto p-6 scrollbar-premium h-full',
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab',
        )}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div className="flex gap-6 h-full items-start min-w-max pb-4">
          <KanbanList title="Backlog" cardCount={5}>
            {BOARD_MOCK_DATA.backlog.map((card, i) => (
              <div
                key={i}
                onClick={() =>
                  i === 0 &&
                  openCardModal('Implement social login (Google, GitHub)')
                }
              >
                <KanbanCard {...card} />
              </div>
            ))}
          </KanbanList>

          <KanbanList title="In Progress" cardCount={3}>
            {BOARD_MOCK_DATA.inProgress.map((card, i) => (
              <KanbanCard key={i} {...card} />
            ))}
          </KanbanList>

          <KanbanList title="Review" cardCount={2}>
            {BOARD_MOCK_DATA.review.map((card, i) => (
              <KanbanCard key={i} {...card} />
            ))}
          </KanbanList>

          <KanbanList title="Done" cardCount={4}>
            {BOARD_MOCK_DATA.done.map((card, i) => (
              <KanbanCard
                key={i}
                title={card.title}
                topBorderColor={card.color}
                dueDate={{ text: `Jul ${20 - i * 2}`, status: 'completed' }}
                labels={
                  card.label
                    ? [
                        {
                          name: card.label,
                          color: 'bg-slate-500',
                          type: 'pill',
                        },
                      ]
                    : []
                }
              />
            ))}
          </KanbanList>
        </div>
      </div>
    </div>
  )
}
