import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import { StorageOverview } from '../components/storage/StorageOverview'
import { BoardStorageTable } from '../components/storage/BoardStorageTable'
import { CleanupTools } from '../components/storage/CleanupTools'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/settings/storage')({
  component: StoragePage,
})

function StoragePage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRefreshKey((prev) => prev + 1)
    setIsRefreshing(false)
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Storage & Data
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Manage local IndexedDB usage and backups for your offline boards.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <Button
            variant="outline"
            className="h-11 px-6 font-bold gap-2 rounded-xl border-border/50 bg-background/50 hover:bg-muted shadow-sm focus-visible:ring-2 focus-visible:ring-primary transition-all active:scale-95"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw
              size={18}
              className={isRefreshing ? 'animate-spin' : ''}
            />
            {isRefreshing ? 'Recalculating...' : 'Recalculate Usage'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Column: Overview Stats */}
        <div className="xl:col-span-1 h-full">
          <StorageOverview key={`overview-${refreshKey}`} />
        </div>

        {/* Right Column: Actions */}
        <div className="xl:col-span-2 h-full">
          <CleanupTools key={`cleanup-${refreshKey}`} />
        </div>

        {/* Bottom Section: Full Width Table */}
        <div className="col-span-1 xl:col-span-3">
          <BoardStorageTable key={`table-${refreshKey}`} />
        </div>
      </div>
    </div>
  )
}
