import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  LayoutGrid,
  MoreVertical,
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

const ITEMS_PER_PAGE = 10

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
      setBoards(data)
      setFilteredBoards(data)
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
      'bg-blue-500/20 text-blue-500',
      'bg-purple-500/20 text-purple-500',
      'bg-green-500/20 text-green-500',
      'bg-orange-500/20 text-orange-500',
      'bg-pink-500/20 text-pink-500',
      'bg-red-500/20 text-red-500',
      'bg-yellow-500/20 text-yellow-500',
      'bg-teal-500/20 text-teal-500',
    ]
    return colors[index % colors.length]
  }

  return (
    <>
      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-6 flex items-center justify-between border-b border-border/50">
          <div>
            <h3 className="font-bold text-base tracking-tight">
              Storage by Board
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Breakdown of space usage per project board.
            </p>
          </div>
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={14}
            />
            <Input
              placeholder="Search boards..."
              className="h-9 pl-9 bg-muted/50 border-none text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 min-h-[300px]">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="font-bold text-[10px] uppercase tracking-widest px-6 h-10">
                  Board Name
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest h-10 text-center">
                  Last Modified
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest h-10 text-center">
                  Items
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest h-10 text-right pr-6">
                  Disk Size
                </TableHead>
                <TableHead className="w-10"></TableHead>
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
                    {searchQuery ? 'No boards found' : 'No boards yet'}
                  </TableCell>
                </TableRow>
              ) : (
                displayedBoards.map((board, index) => (
                  <TableRow
                    key={board.boardId}
                    className="hover:bg-muted/10 transition-colors border-b border-border/50"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${getBoardColor(index)}`}
                        >
                          <LayoutGrid size={16} />
                        </div>
                        <span className="font-bold text-sm tracking-tight">
                          {board.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-muted-foreground text-center">
                      {formatRelativeTime(board.lastModified)}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-muted-foreground text-center">
                      {board.cardCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <span className="text-sm font-black tracking-tight">
                        {formatBytes(board.size)}
                      </span>
                    </TableCell>
                    <TableCell className="pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
                            className="text-red-500 hover:text-red-600"
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
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredBoards.length)} of{' '}
              {filteredBoards.length} boards
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
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
              Are you sure you want to delete "{boardToDelete?.name}"? This will
              permanently delete the board and all its data including cards,
              attachments, and comments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDeleteBoard}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
