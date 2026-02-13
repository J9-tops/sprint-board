import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  RefreshCcw,
} from 'lucide-react'
import { StorageOverview } from '../components/storage/StorageOverview'
import { BoardStorageTable } from '../components/storage/BoardStorageTable'
import { CleanupTools } from '../components/storage/CleanupTools'
import { Button } from '@/components/ui/button'
import { getStorageOverview, getStorageWarningLevel } from '@/services'

export const Route = createFileRoute('/settings/storage')({
  component: StoragePage,
})

function StoragePage() {
  const [storageData, setStorageData] = useState<{
    total: number
    boards: number
    attachments: number
    archived: number
    available: number
    percentUsed: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadStorageData = async () => {
    setIsLoading(true)
    try {
      const data = await getStorageOverview()
      setStorageData(data)
    } catch (e) {
      console.error('Failed to load storage:', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStorageData()
  }, [])

  const warningLevel = storageData
    ? getStorageWarningLevel(storageData.percentUsed)
    : 'ok'
  const percentUsed = storageData?.percentUsed ?? 0

  const getWarningBanner = () => {
    if (warningLevel === 'critical') {
      return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-red-500/20 text-red-500 mt-0.5">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">
              Critical Storage Warning
            </h4>
            <p className="text-sm text-red-200/80 font-medium leading-relaxed">
              You have used {percentUsed.toFixed(0)}% of the available browser
              storage quota. Performance may degrade. Please clean up old data.
            </p>
          </div>
        </div>
      )
    }

    if (warningLevel === 'warning') {
      return (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500 mt-0.5">
            <AlertCircle size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-orange-500 uppercase tracking-widest">
              Storage Warning
            </h4>
            <p className="text-sm text-orange-200/80 font-medium leading-relaxed">
              You have used {percentUsed.toFixed(0)}% of the available browser
              storage quota. Performance may degrade if you exceed 80%.
            </p>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Storage & Data
          </h1>
          <p className="text-muted-foreground font-medium text-base">
            Manage local IndexedDB usage and backups for your offline boards.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <Button
            variant="outline"
            className="h-11 px-6 font-bold gap-2 rounded-xl border-border/50 bg-background/50 hover:bg-muted shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
            onClick={loadStorageData}
            disabled={isLoading}
          >
            <RefreshCcw size={18} />
            Recalculate
          </Button>
        </div>
      </div>

      {getWarningBanner()}

      {warningLevel === 'ok' && storageData && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-green-500/20 text-green-500 mt-0.5">
            <CheckCircle2 size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-green-500 uppercase tracking-widest">
              Storage Healthy
            </h4>
            <p className="text-sm text-green-200/80 font-medium leading-relaxed">
              Your storage usage is at {percentUsed.toFixed(0)}%. Everything
              looks good!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-8 h-full">
          <StorageOverview />
          <CleanupTools />
        </div>
        <div className="lg:col-span-8">
          <BoardStorageTable />
        </div>
      </div>
    </div>
  )
}
