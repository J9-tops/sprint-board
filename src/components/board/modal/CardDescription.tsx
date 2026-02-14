import { EditorContent } from '@tiptap/react'
import {
  AlignLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRichTextEditor } from '@/hooks/useRichTextEditor'

export function CardDescription() {
  const editor = useRichTextEditor()

  const toolbarButtons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: 'bold',
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: 'italic',
    },
    {
      icon: UnderlineIcon,
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: 'underline',
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: 'bulletList',
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: 'orderedList',
    },
  ]

  return (
    <div className="flex items-start gap-4">
      <div className="mt-2 text-muted-foreground">
        <AlignLeft size={20} />
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base tracking-tight text-foreground">
            Description
          </h3>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 font-bold text-xs uppercase tracking-widest px-3 focus-visible:ring-2 focus-visible:ring-primary outline-none border border-transparent"
          >
            Edit
          </Button>
        </div>

        <div className="group relative">
          <div className="flex items-center gap-1 p-1 mb-1 bg-muted/50 rounded-md border border-border/50 opacity-0 group-focus-within:opacity-100 transition-opacity">
            {toolbarButtons.map((btn, i) => (
              <Button
                key={i}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8',
                  editor.isActive(btn.active) && 'bg-muted text-primary',
                )}
                onClick={btn.action}
              >
                <btn.icon size={14} />
              </Button>
            ))}
          </div>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
