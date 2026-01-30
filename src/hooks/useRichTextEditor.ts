import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'

export function useRichTextEditor(placeholder: string = 'Add a more detailed description...') {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-30 focus:outline-none py-2 px-3 bg-muted/30 rounded-md hover:bg-muted/50 focus:bg-background transition-all border border-transparent focus:border-input',
      },
    },
  })

  return editor
}
