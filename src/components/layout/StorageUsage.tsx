import { Database } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import {
  formatBytes,
  getStorageLimitConfig,
  getStorageOverview,
} from '@/services'

export function StorageUsage() {
  const [percentUsed, setPercentUsed] = useState(0)
  const [usedBytes, setUsedBytes] = useState(0)
  const [limitBytes, setLimitBytes] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStorage = async () => {
      try {
        const data = await getStorageOverview()
        const config = getStorageLimitConfig()
        setPercentUsed(data.percentUsed)
        setUsedBytes(data.total)
        setLimitBytes(config.customLimit)
      } catch (e) {
        console.error('Failed to load storage:', e)
      } finally {
        setIsLoading(false)
      }
    }
    loadStorage()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 animate-pulse h-[88px]" />
    )
  }

  return (
    <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 flex flex-col gap-4 focus-within:ring-2 focus-within:ring-primary/50 outline-none">
      <div className="flex items-center gap-2.5 text-xs font-bold text-foreground select-none uppercase tracking-wider">
        <div className="p-1.5 bg-background rounded-lg border border-border/50 shadow-sm">
          <Database size={14} className="text-primary" />
        </div>
        <span>Storage Usage</span>
      </div>
      <div className="space-y-2">
        <Progress
          value={percentUsed}
          className="h-1.5"
          aria-label="Storage consumption progress"
        />
        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground select-none uppercase tracking-wide">
          <span>
            {formatBytes(usedBytes)} of {formatBytes(limitBytes)}
          </span>
          <span>{percentUsed.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  )
}
