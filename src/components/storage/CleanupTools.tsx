import { Download, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { compressAllImages, exportAllBoards, formatBytes } from '@/services'
import { cn } from '@/lib/utils'

export function CleanupTools() {
  const [compressResult, setCompressResult] = useState<{
    count: number
    savedBytes: number
  } | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const [isExporting, setIsExporting] = useState(false)

  const handleCompressImages = async () => {
    setIsCompressing(true)
    setCompressResult(null)
    try {
      const result = await compressAllImages()
      setCompressResult(result)
    } catch (e) {
      console.error('Failed to compress images:', e)
    } finally {
      setIsCompressing(false)
    }
  }

  const handleExportAll = async () => {
    setIsExporting(true)
    try {
      const boards = await exportAllBoards()
      const json = JSON.stringify(boards, null, 2)
      const blob = new Blob([json], { type: 'application/json' })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `sprint-board-export-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Failed to export data:', e)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          Cleanup & Maintenance
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Compress Images */}
        <ActionCard
          icon={<ImageIcon className="h-5 w-5 text-blue-500" />}
          title="Compress Images"
          description="Reduce size of attachments"
          actionLabel={isCompressing ? 'Compressing...' : 'Run Compression'}
          onClick={handleCompressImages}
          disabled={isCompressing}
          variant="default"
        >
          {compressResult && (
            <p className="text-xs text-green-600 font-bold mt-2 bg-green-500/10 p-2 rounded-lg inline-block">
              Saved {formatBytes(compressResult.savedBytes)}
            </p>
          )}
        </ActionCard>

        {/* Backup */}
        <ActionCard
          icon={<Download className="h-5 w-5 text-green-500" />}
          title="Export Data"
          description="Create a full JSON backup"
          actionLabel={isExporting ? 'Exporting...' : 'Download JSON'}
          onClick={handleExportAll}
          disabled={isExporting}
          variant="primary"
        />
      </div>
      {/* End Grid */}
    </div>
  )
}

interface ActionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel: string
  onClick: () => void
  disabled?: boolean
  children?: React.ReactNode
  variant?: 'default' | 'danger' | 'primary'
}

function ActionCard({
  icon,
  title,
  description,
  actionLabel,
  onClick,
  disabled,
  children,
  variant = 'default',
}: ActionCardProps) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group">
      <div className="space-y-3">
        <div className="bg-muted/30 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-muted/50 transition-colors">
          {icon}
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm tracking-tight">{title}</h4>
          <p className="text-xs text-muted-foreground font-medium pr-4">
            {description}
          </p>
        </div>
        {children}
      </div>

      <div className="pt-6 mt-auto">
        <Button
          variant={
            variant === 'danger'
              ? 'destructive'
              : variant === 'primary'
                ? 'default'
                : 'outline'
          }
          size="sm"
          className={cn(
            'w-full font-bold text-xs h-9',
            variant === 'default' &&
              'bg-transparent border-primary/20 hover:bg-primary/5 text-primary',
          )}
          onClick={onClick}
          disabled={disabled}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  )
}
