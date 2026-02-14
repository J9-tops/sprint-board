import { HardDrive, KanbanSquare, Plus, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WelcomeScreenProps {
  onCreateFirstBoard: () => void
}

export function WelcomeScreen({ onCreateFirstBoard }: WelcomeScreenProps) {
  const features = [
    {
      icon: Zap,
      title: 'Instant Performance',
      description:
        'Everything is stored locally in your browser for zero latency.',
    },
    {
      icon: Shield,
      title: 'Complete Privacy',
      description:
        'Your data never leaves your device. No accounts, no tracking.',
    },
    {
      icon: HardDrive,
      title: 'Offline First',
      description: 'Works perfectly without an internet connection.',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-2xl mx-auto space-y-10 px-6">
      <div className="space-y-4">
        <div className="bg-primary text-primary-foreground p-4 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 rotate-3">
          <KanbanSquare size={40} />
        </div>
        <h1 className="text-5xl font-black tracking-tighter">
          Welcome to Sprintboard
        </h1>
        <p className="text-xl text-muted-foreground font-medium leading-relaxed">
          The simple, private, and lightning-fast way to organize your projects.
          Built entirely for your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {features.map((f) => (
          <div
            key={f.title}
            className="space-y-2 p-4 rounded-2xl bg-muted/30 border border-border/50"
          >
            <div className="text-primary bg-background w-10 h-10 rounded-lg flex items-center justify-center border shadow-sm">
              <f.icon size={20} />
            </div>
            <h3 className="font-bold text-sm tracking-tight">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {f.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button
          onClick={onCreateFirstBoard}
          size="lg"
          className="h-14 px-10 text-base font-black uppercase tracking-widest shadow-xl shadow-primary/20"
        >
          <Plus className="mr-2 h-5 w-5" /> Create Your First Board
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-14 px-10 text-base font-bold uppercase tracking-widest"
        >
          Load Demo Board
        </Button>
      </div>
    </div>
  )
}
