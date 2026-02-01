/**
 * Board service - Business logic for board management.
 * Orchestrates database operations and provides a clean API for UI components.
 */

import {
  BOARD_BACKGROUNDS,
  addLabelToCard,
  cascadeDeleteBoard,
  createCard,
  createLabel,
  createList,
  archiveBoard as dbArchiveBoard,
  createBoard as dbCreateBoard,
  restoreBoard as dbRestoreBoard,
  updateBoard as dbUpdateBoard,
  getActiveBoards,
  getArchivedBoards,
  getBoardOrThrow,
  getBoardsByWorkspace,
  getCardsByBoard,
  getLabelsByBoard,
  getLabelsForCard,
  getListsByBoard,
  getStarredBoards,
  toggleBoardStar,
} from '../db'
import type { Board, BoardWithData } from '../db'

// ============================================================================
// Board Operations
// ============================================================================

/**
 * Create a new board with a default "To Do" list.
 */
export async function createBoard(
  name: string,
  background: string = BOARD_BACKGROUNDS.SOLID[0],
  description: string = '',
  workspaceId: string | null = null,
): Promise<BoardWithData> {
  // Create the board
  const board = await dbCreateBoard({
    name,
    description,
    background,
    isStarred: false,
    isArchived: false,
    position: 0, // Will be calculated by dbCreateBoard
    workspaceId,
  })

  // Create default list
  const defaultList = await createList({
    boardId: board.id,
    name: 'To Do',
    position: 0,
    isArchived: false,
    isCollapsed: false,
  })

  return {
    ...board,
    lists: [{ ...defaultList, cards: [] }],
    labels: [],
  }
}

/**
 * Get a board with all its data (lists, cards, labels).
 */
export async function getBoardWithData(
  boardId: string,
): Promise<BoardWithData> {
  const board = await getBoardOrThrow(boardId)
  const lists = await getListsByBoard(boardId)
  const cards = await getCardsByBoard(boardId)
  const labels = await getLabelsByBoard(boardId)

  // Group cards by list
  const cardsByList = new Map<string, typeof cards>()
  for (const card of cards) {
    if (!cardsByList.has(card.listId)) {
      cardsByList.set(card.listId, [])
    }
    cardsByList.get(card.listId)!.push(card)
  }

  // Build lists with cards
  const listsWithCards = lists
    .filter((list) => !list.isArchived)
    .map((list) => ({
      ...list,
      cards: (cardsByList.get(list.id) || [])
        .filter((card) => !card.isArchived)
        .sort((a, b) => a.position - b.position),
    }))

  return {
    ...board,
    lists: listsWithCards,
    labels,
  }
}

/**
 * Get all boards for the dashboard.
 */
export async function getBoards(): Promise<Array<Board>> {
  return getActiveBoards()
}

/**
 * Get boards by workspace.
 */
export { getBoardsByWorkspace }

/**
 * Get starred boards.
 */
export { getStarredBoards }

/**
 * Get archived boards.
 */
export { getArchivedBoards }

/**
 * Update board properties.
 */
export async function updateBoard(
  boardId: string,
  updates: Partial<Pick<Board, 'name' | 'description' | 'background'>>,
): Promise<Board> {
  return dbUpdateBoard(boardId, updates)
}

/**
 * Toggle board star status.
 */
export async function toggleStar(boardId: string): Promise<Board> {
  return toggleBoardStar(boardId)
}

/**
 * Archive a board (soft delete).
 */
export async function archiveBoard(boardId: string): Promise<Board> {
  return dbArchiveBoard(boardId)
}

/**
 * Restore an archived board.
 */
export async function restoreBoard(boardId: string): Promise<Board> {
  return dbRestoreBoard(boardId)
}

/**
 * Permanently delete a board and all its data.
 */
export async function deleteBoard(boardId: string): Promise<void> {
  return cascadeDeleteBoard(boardId)
}

/**
 * Duplicate a board with all its lists, cards, and labels.
 */
export async function duplicateBoard(
  boardId: string,
  newName?: string,
): Promise<BoardWithData> {
  const source = await getBoardWithData(boardId)

  // Create new board
  const newBoard = await dbCreateBoard({
    name: newName || `${source.name} (Copy)`,
    description: source.description,
    background: source.background,
    isStarred: false,
    isArchived: false,
    position: 0,
    workspaceId: source.workspaceId,
  })

  // Map old IDs to new IDs for labels
  const labelIdMap = new Map<string, string>()

  // Copy labels
  for (const label of source.labels) {
    const newLabel = await createLabel({
      boardId: newBoard.id,
      name: label.name,
      color: label.color,
    })
    labelIdMap.set(label.id, newLabel.id)
  }

  // Copy lists and cards
  const newLists: BoardWithData['lists'] = []

  for (const list of source.lists) {
    const newList = await createList({
      boardId: newBoard.id,
      name: list.name,
      position: list.position,
      isArchived: false,
      isCollapsed: false,
    })

    const newCards = []
    for (const card of list.cards) {
      // Get labels for source card
      const cardLabels = await getLabelsForCard(card.id)

      const newCard = await createCard({
        listId: newList.id,
        boardId: newBoard.id,
        title: card.title,
        description: card.description,
        position: card.position,
        coverType: card.coverType,
        coverValue: card.coverValue,
        dueDate: card.dueDate,
        dueDateCompleted: false,
        isArchived: false,
      })

      // Copy labels to new card
      for (const label of cardLabels) {
        const newLabelId = labelIdMap.get(label.id)
        if (newLabelId) {
          await addLabelToCard(newCard.id, newLabelId)
        }
      }

      newCards.push(newCard)
    }

    newLists.push({ ...newList, cards: newCards })
  }

  const { getLabelsByBoard: getLabels } = await import('../db')
  const newLabels = await getLabels(newBoard.id)

  return {
    ...newBoard,
    lists: newLists,
    labels: newLabels,
  }
}
