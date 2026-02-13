import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Database,
  Paperclip,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatBytes, getStorageOverview, getStorageWarningLevel } from '@/services'
import { cn } from '@/lib/utils'

export function StorageOverview() {
  const [storageData, setStorageData] = useState<{
    total: number
    boards: number
    boardCount: number
    attachments: number
    attachmentCount: number
    archived: number
    available: number
    percentUsed: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initial load
    loadStorage()

    // Listen for storage updates (if we had a global event system, we'd hook here)
    // For now, we'll just load once.
  }, [])

  const loadStorage = async () => {
    try {
      const data = await getStorageOverview()
      setStorageData(data)
    } catch (e) {
      console.error('Failed to load storage:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const percentUsed = storageData?.percentUsed ?? 0
  const usedBytes = storageData?.total ?? 0
  const freeBytes = storageData?.available ?? 0
  const warningLevel = getStorageWarningLevel(percentUsed)

  // Determine status color and icon based on usage
  const getStatusColor = () => {
    if (warningLevel === 'critical') return 'text-red-500'
    if (warningLevel === 'warning') return 'text-orange-500'
    return 'text-green-500'
  }

  const getStatusBg = () => {
    if (warningLevel === 'critical') return 'bg-red-500/10 border-red-500/20'
    if (warningLevel === 'warning') return 'bg-orange-500/10 border-orange-500/20'
    return 'bg-green-500/10 border-green-500/20'
  }

  const getStatusIcon = () => {
    if (warningLevel === 'critical') return <AlertTriangle className="h-5 w-5" />
    if (warningLevel === 'warning') return <AlertCircle className="h-5 w-5" />
    return <CheckCircle2 className="h-5 w-5" />
  }

  const getStatusText = () => {
    if (warningLevel === 'critical') return 'Critical Usage'
    if (warningLevel === 'warning') return 'High Usage'
    return 'Healthy Storage'
  }

  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm h-full flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold tracking-tight">Storage Overview</h3>
            <p className="text-sm text-muted-foreground">Local browser quota</p>
          </div>
          <div className={cn("px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border", getStatusBg(), getStatusColor())}>
            {getStatusIcon()}
            {getStatusText()}
          </div>
        </div>

        {/* Circular Progress & Main Stat */}
        <div className="flex items-center gap-8 justify-center py-4">
          <div className="relative h-40 w-40 flex items-center justify-center">
            <svg className="h-full w-full transform -rotate-90 overflow-visible" viewBox="0 0 160 160">
              {/* Background Circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-muted/10"
              />
              {/* Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={439.8}
                strokeDashoffset={439.8 * (1 - percentUsed / 100)}
                className={cn("transition-all duration-1000 ease-out", getStatusColor())}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black tracking-tighter">
                {percentUsed.toFixed(0)}<span className="text-xl">%</span>
              </span>
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
                Used
              </span>
            </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Used Space</div>
                <div className="text-2xl font-black tracking-tight flex items-baseline gap-1">
                    {formatBytes(usedBytes)}
                </div>
             </div>
             <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Free Space</div>
                <div className="text-2xl font-black tracking-tight text-muted-foreground flex items-baseline gap-1">
                    {formatBytes(freeBytes)}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatItem 
            icon={<Database className="h-4 w-4 text-blue-500" />}
            label="Boards"
            value={storageData?.boardCount ?? 0}
            className="bg-blue-500/5 hover:bg-blue-500/10 text-blue-700 dark:text-blue-300"
        />
         <StatItem 
            icon={<Paperclip className="h-4 w-4 text-purple-500" />}
            label="Attachments"
            value={storageData?.attachmentCount ?? 0}
            className="bg-purple-500/5 hover:bg-purple-500/10 text-purple-700 dark:text-purple-300"
        />
      </div>
    </div>
  )
}

function StatItem({ icon, label, value, className }: { icon: React.ReactNode, label: string, value: number, className?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-3 rounded-2xl transition-colors cursor-default", className)}>
            <div className="mb-1 opacity-80">{icon}</div>
            <span className="text-xl font-black tracking-tight">{value}</span>
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">{label}</span>
        </div>
    )
}
