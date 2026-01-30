import { X } from 'lucide-react'
import { CardTitle } from './CardTitle'
import { CardBadges } from './CardBadges'
import { CardDescription } from './CardDescription'
import { CardChecklist } from './CardChecklist'
import { CardAttachments } from './CardAttachments'
import { CardSidebar } from './CardSidebar'
import type { CardModalProps } from '@/types/modals'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CardModalContentProps extends CardModalProps {
  onClose: () => void
}

export function CardModalContent({ card, onClose }: CardModalContentProps) {
  return (
    <div className="flex flex-col h-full bg-card">
      <header className="h-16 flex items-center justify-between px-6 border-b shrink-0 bg-muted/20">
        <div className="flex items-center gap-2"></div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X size={20} />
        </Button>
      </header>
      <ScrollArea className="flex-1">
        <div className="p-8 space-y-10">
          <div className="h-40 w-full rounded-xl bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-950 flex items-end justify-end p-4 mb-6">
            <Button
              variant="secondary"
              size="sm"
              className="bg-background/20 backdrop-blur text-white border-white/10 text-[10px] uppercase font-black tracking-widest h-7 focus-visible:ring-2 focus-visible:ring-white/50 outline-none"
            >
              Cover
            </Button>
          </div>
          <CardTitle title={card.title} />
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-10">
              <CardBadges labels={card.labels} dueDate={card.dueDate} />
              <CardDescription />
              <CardChecklist />
              <CardAttachments />
            </div>
            <CardSidebar />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
