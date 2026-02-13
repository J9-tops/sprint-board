import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Layers,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  cascadeDeleteBoard,
  downloadBoardAsJson,
  formatBytes,
  getBoardStorageBreakdown,
} from '@/services'
import { cn } from '@/lib/utils'

const ITEMS_PER_PAGE = 8

interface BoardStorageRow {
  boardId: string
  name: string
  size: number
  cardCount: number
  attachmentCount: number
  lastModified: number
}

export function BoardStorageTable() {
  const navigate = useNavigate()
  const [boards, setBoards] = useState<Array<BoardStorageRow>>([])
  const [filteredBoards, setFilteredBoards] = useState<Array<BoardStorageRow>>(
    [],
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [boardToDelete, setBoardToDelete] = useState<BoardStorageRow | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await getBoardStorageBreakdown()
      setBoards(data.sort((a, b) => b.size - a.size)) // Default sort by size desc
      setFilteredBoards(data.sort((a, b) => b.size - a.size))
    } catch (e) {
      console.error('Failed to load board storage:', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBoards(boards)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredBoards(
        boards.filter((b) => b.name.toLowerCase().includes(query)),
      )
    }
    setCurrentPage(1)
  }, [searchQuery, boards])

  const totalPages = Math.ceil(filteredBoards.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const displayedBoards = filteredBoards.slice(startIndex, endIndex)

  // Calculate max size for relative bars
  const maxSize = Math.max(...boards.map((b) => b.size), 1)

  const handleViewBoard = (boardId: string) => {
    navigate({ to: `/board/${boardId}` })
  }

  const handleEditBoard = (boardId: string) => {
    navigate({ to: `/board/${boardId}` })
  }

  const handleExportBoard = async (boardId: string) => {
    try {
      await downloadBoardAsJson(boardId)
    } catch (e) {
      console.error('Failed to export board:', e)
    }
  }

  const handleDeleteBoard = (board: BoardStorageRow) => {
    setBoardToDelete(board)
    setShowDeleteDialog(true)
  }

  const confirmDeleteBoard = async () => {
    if (!boardToDelete) return

    setIsDeleting(true)
    try {
      await cascadeDeleteBoard(boardToDelete.boardId)
      setShowDeleteDialog(false)
      setBoardToDelete(null)
      await loadData()
    } catch (e) {
      console.error('Failed to delete board:', e)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatRelativeTime = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`
    return `${Math.floor(seconds / 2592000)}mo ago`
  }

  const getBoardColor = (index: number): string => {
    const colors = [
      'bg-blue-500 text-blue-100',
      'bg-purple-500 text-purple-100',
      'bg-emerald-500 text-emerald-100',
      'bg-orange-500 text-orange-100',
      'bg-pink-500 text-pink-100',
      'bg-indigo-500 text-indigo-100',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          Board Storage Details
        </h3>
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={14}
          />
          <Input
            placeholder="Search boards..."
            className="h-9 pl-9 bg-muted/50 border-transparent focus:border-primary/20 focus:bg-background transition-all text-sm rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="font-bold text-[10px] uppercase tracking-widest px-6 h-11 text-muted-foreground">
                  Board Name
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest h-11 text-muted-foreground">
                  Last Modified
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest h-11 text-muted-foreground">
                  Items
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest h-11 text-right text-muted-foreground w-48">
                  Usage
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : displayedBoards.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    {searchQuery
                      ? 'No boards found matching your search'
                      : 'No boards created yet'}
                  </TableCell>
                </TableRow>
              ) : (
                displayedBoards.map((board, index) => (
                  <TableRow
                    key={board.boardId}
                    className="group hover:bg-muted/50 transition-colors border-b border-border/50"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center shadow-sm',
                            getBoardColor(index),
                          )}
                        >
                          <LayoutGrid size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-sm tracking-tight text-foreground">
                            {board.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            {board.boardId.substring(0, 8)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={12} className="opacity-70" />
                        <span className="text-xs font-medium">
                          {formatRelativeTime(board.lastModified)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div
                          className="flex items-center gap-1.5 min-w-[60px]"
                          title="Cards"
                        >
                          <Layers size={14} className="text-muted-foreground" />
                          <span className="text-xs font-bold text-foreground">
                            {board.cardCount}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-black tracking-tight font-mono">
                          {formatBytes(board.size)}
                        </span>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/80 rounded-full"
                            style={{
                              width: `${Math.max((board.size / maxSize) * 100, 1)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => handleViewBoard(board.boardId)}
                          >
                            <Eye size={14} className="mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditBoard(board.boardId)}
                          >
                            <Pencil size={14} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleExportBoard(board.boardId)}
                          >
                            <Download size={14} className="mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:text-red-600 focus:text-red-600 focus:bg-red-500/10"
                            onClick={() => handleDeleteBoard(board)}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredBoards.length > ITEMS_PER_PAGE && (
          <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
              Viewing {startIndex + 1}-
              {Math.min(endIndex, filteredBoards.length)} of{' '}
              {filteredBoards.length}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Board</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-bold text-foreground">
                "{boardToDelete?.name}"
              </span>
              ?
              <br />
              <br />
              This will permanently delete the board and all its data including
              cards, attachments, and comments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDeleteBoard}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Board'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
