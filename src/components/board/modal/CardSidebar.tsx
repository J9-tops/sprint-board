import {
  Tag,
  CheckSquare,
  Clock,
  Paperclip,
  Image,
  ArrowRight,
  Copy,
  Archive,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CardSidebar() {
  const sections = [
    {
      title: 'Add to card',
      items: [
        { icon: Tag, label: 'Labels' },
        { icon: CheckSquare, label: 'Checklist' },
        { icon: Clock, label: 'Dates' },
        { icon: Paperclip, label: 'Attachment' },
        { icon: Image, label: 'Cover' },
      ],
    },
    {
      title: 'Actions',
      items: [
        { icon: ArrowRight, label: 'Move' },
        { icon: Copy, label: 'Copy' },
        { icon: Archive, label: 'Archive' },
      ],
    },
  ]

  return (
    <div className="w-48 space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="space-y-2">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-2">
            {section.title}
          </h4>
          <div className="flex flex-col gap-1">
            {section.items.map((item) => (
              <Button
                key={item.label}
                variant="secondary"
                className="justify-start gap-3 h-10 px-3 text-[11px] font-bold text-foreground/70 hover:text-foreground bg-muted/40 hover:bg-muted/80 border-none transition-all rounded-lg"
              >
                <item.icon size={16} className="text-foreground/60" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
