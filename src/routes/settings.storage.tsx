import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { StorageOverview } from '../components/storage/StorageOverview'
import { BoardStorageTable } from '../components/storage/BoardStorageTable'
import { CleanupTools } from '../components/storage/CleanupTools'
import { GrowthTrend } from '../components/storage/GrowthTrend'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/settings/storage')({
  component: StoragePage,
})

function StoragePage() {
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
          >
            <RefreshCcw size={18} />
            Recalculate
          </Button>
        </div>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 flex items-start gap-4">
        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500 mt-0.5">
          <AlertTriangle size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-orange-500 uppercase tracking-widest">
            Storage Warning
          </h4>
          <p className="text-sm text-orange-200/80 font-medium leading-relaxed">
            You have used over 60% of the available browser storage quota.
            Performance may degrade if you exceed 80%.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-8 h-full">
          <StorageOverview />
          <CleanupTools />
        </div>
        <div className="lg:col-span-8 space-y-8">
          <BoardStorageTable />
          <GrowthTrend />
        </div>
      </div>
    </div>
  )
}
