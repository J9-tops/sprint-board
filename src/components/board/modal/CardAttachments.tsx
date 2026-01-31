import { FileText, Image as ImageIcon, Paperclip } from 'lucide-react'

export function CardAttachments() {
  const files = [
    {
      name: 'mockup_v2.png',
      type: 'Image',
      size: '2.4 MB',
      date: 'Added Oct 23 at 4:20 PM',
      icon: ImageIcon,
    },
    {
      name: 'requirements_specs.pdf',
      type: 'PDF',
      size: '1.2 MB',
      date: 'Added Oct 21 at 9:00 AM',
      icon: FileText,
    },
  ]

  return (
    <div className="flex items-start gap-4">
      <div className="mt-2 text-muted-foreground">
        <Paperclip size={20} />
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-base tracking-tight text-foreground">
            Attachments
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((file, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-xl overflow-hidden p-3 transition-all cursor-pointer"
            >
              <div className="h-16 w-20 bg-muted-foreground/10 rounded-lg flex items-center justify-center text-muted-foreground uppercase">
                {file.type === 'Image' ? (
                  <div className="h-full w-full bg-orange-200/50 flex items-center justify-center rounded-lg">
                    <file.icon size={24} className="text-orange-600" />
                  </div>
                ) : (
                  <div className="h-full w-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center rounded-lg font-black text-xs">
                    PDF
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">
                  {file.name}
                </h4>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  {file.date}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-muted-foreground/30">
                    Download
                  </button>
                  <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 underline underline-offset-4 decoration-muted-foreground/30">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
