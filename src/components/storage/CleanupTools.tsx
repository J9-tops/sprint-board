import { Download } from 'lucide-react'
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
import {
  compressAllImages,
  deleteArchivedBoards,
  deleteArchivedCards,
  exportAllBoards,
  formatBytes,
} from '@/services'

export function CleanupTools() {
  const [compressResult, setCompressResult] = useState<{
    count: number
    savedBytes: number
  } | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const [showDeleteBoardsDialog, setShowDeleteBoardsDialog] = useState(false)
  const [isDeletingBoards, setIsDeletingBoards] = useState(false)
  const [deletedBoardsCount, setDeletedBoardsCount] = useState<number | null>(
    null,
  )

  const [showDeleteCardsDialog, setShowDeleteCardsDialog] = useState(false)
  const [isDeletingCards, setIsDeletingCards] = useState(false)
  const [deletedCardsCount, setDeletedCardsCount] = useState<number | null>(
    null,
  )

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

  const handleDeleteArchivedBoards = async () => {
    setIsDeletingBoards(true)
    setDeletedBoardsCount(null)
    try {
      const count = await deleteArchivedBoards()
      setDeletedBoardsCount(count)
      setShowDeleteBoardsDialog(false)
    } catch (e) {
      console.error('Failed to delete archived boards:', e)
    } finally {
      setIsDeletingBoards(false)
    }
  }

  const handleDeleteArchivedCards = async () => {
    setIsDeletingCards(true)
    setDeletedCardsCount(null)
    try {
      const count = await deleteArchivedCards()
      setDeletedCardsCount(count)
      setShowDeleteCardsDialog(false)
    } catch (e) {
      console.error('Failed to delete archived cards:', e)
    } finally {
      setIsDeletingCards(false)
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
    <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-6 shadow-sm">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-widest px-1">
        Maintenance Tools
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold">Compress Images</h4>
            <p className="text-xs text-muted-foreground font-medium">
              Reduce size of attachments
            </p>
            {compressResult && (
              <p className="text-[10px] text-green-500 font-medium">
                Compressed {compressResult.count} images, saved{' '}
                {formatBytes(compressResult.savedBytes)}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-xs px-4 h-8 uppercase tracking-widest"
            onClick={handleCompressImages}
            disabled={isCompressing}
          >
            {isCompressing ? 'Compressing...' : 'Run'}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold">Clear Archived Boards</h4>
            <p className="text-xs text-muted-foreground font-medium">
              Remove old archived boards
            </p>
            {deletedBoardsCount !== null && (
              <p className="text-[10px] text-red-500 font-medium">
                Deleted {deletedBoardsCount} boards
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-xs px-4 h-8 uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
            onClick={() => setShowDeleteBoardsDialog(true)}
            disabled={isDeletingBoards}
          >
            {isDeletingBoards ? 'Deleting...' : 'Delete'}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold">Clear Archived Cards</h4>
            <p className="text-xs text-muted-foreground font-medium">
              Remove old archived cards
            </p>
            {deletedCardsCount !== null && (
              <p className="text-[10px] text-red-500 font-medium">
                Deleted {deletedCardsCount} cards
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-xs px-4 h-8 uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
            onClick={() => setShowDeleteCardsDialog(true)}
            disabled={isDeletingCards}
          >
            {isDeletingCards ? 'Deleting...' : 'Delete'}
          </Button>
        </div>

        <div className="space-y-3 pt-2">
          <div className="space-y-0.5 px-1">
            <h4 className="text-sm font-bold">Data Backup</h4>
            <p className="text-xs text-muted-foreground font-medium">
              Create a full JSON export of all boards
            </p>
          </div>
          <Button
            className="w-full h-11 font-black uppercase tracking-[0.15em] text-xs shadow-lg shadow-primary/20"
            onClick={handleExportAll}
            disabled={isExporting}
          >
            {isExporting ? (
              'Exporting...'
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Export All Data
              </>
            )}
          </Button>
        </div>
      </div>

      <AlertDialog
        open={showDeleteBoardsDialog}
        onOpenChange={setShowDeleteBoardsDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Archived Boards</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all archived boards and all their
              data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteArchivedBoards}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showDeleteCardsDialog}
        onOpenChange={setShowDeleteCardsDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Archived Cards</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all archived cards and all their
              data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteArchivedCards}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
