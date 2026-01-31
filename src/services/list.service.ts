/**
 * List service - Business logic for list management.
 */

import {
  createList as dbCreateList,
  getList,
  getListOrThrow,
  getListsByBoard,
  getActiveListsByBoard,
  updateList as dbUpdateList,
  archiveList as dbArchiveList,
  restoreList as dbRestoreList,
  toggleListCollapse,
  cascadeDeleteList,
  getActiveCardsByList,
  createCard,
  updateCard,
  moveListTransaction,
  batchUpdatePositions,
  POSITION_GAP,
  type List,
  type ListWithCards,
} from '../db'

// ============================================================================
// List Operations
// ============================================================================

/**
 * Create a new list at the end of the board.
 */
export async function createList(boardId: string, name: string): Promise<List> {
  return dbCreateList({
    boardId,
    name,
    position: 0, // Will be calculated by dbCreateList
    isArchived: false,
    isCollapsed: false,
  })
}

/**
 * Get a list by ID.
 */
export { getList, getListOrThrow }

/**
 * Get all lists for a board (sorted by position).
 */
export { getListsByBoard, getActiveListsByBoard }

/**
 * Get a list with its cards.
 */
export async function getListWithCards(listId: string): Promise<ListWithCards> {
  const list = await getListOrThrow(listId)
  const cards = await getActiveCardsByList(listId)

  return {
    ...list,
    cards: cards.sort((a, b) => a.position - b.position),
  }
}

/**
 * Update list properties (e.g., rename).
 */
export async function updateList(
  listId: string,
  updates: Partial<Pick<List, 'name' | 'isCollapsed'>>,
): Promise<List> {
  return dbUpdateList(listId, updates)
}

/**
 * Rename a list.
 */
export async function renameList(listId: string, name: string): Promise<List> {
  return dbUpdateList(listId, { name })
}

/**
 * Toggle list collapsed state.
 */
export { toggleListCollapse }

/**
 * Archive a list.
 */
export async function archiveList(listId: string): Promise<List> {
  return dbArchiveList(listId)
}

/**
 * Restore an archived list.
 */
export async function restoreList(listId: string): Promise<List> {
  return dbRestoreList(listId)
}

/**
 * Delete a list permanently.
 */
export async function deleteList(listId: string): Promise<void> {
  return cascadeDeleteList(listId)
}

/**
 * Move all cards from one list to another.
 */
export async function moveAllCards(
  sourceListId: string,
  targetListId: string,
): Promise<void> {
  const sourceCards = await getActiveCardsByList(sourceListId)
  const targetCards = await getActiveCardsByList(targetListId)

  // Calculate starting position in target list
  const maxPosition =
    targetCards.length > 0 ? Math.max(...targetCards.map((c) => c.position)) : 0

  // Move each card to target list with new positions
  let position = maxPosition + POSITION_GAP
  for (const card of sourceCards) {
    await updateCard(card.id, {
      listId: targetListId,
      position,
    })
    position += POSITION_GAP
  }
}

/**
 * Copy a list with all its cards.
 */
export async function copyList(
  listId: string,
  newName?: string,
): Promise<ListWithCards> {
  const source = await getListWithCards(listId)

  // Create new list
  const newList = await dbCreateList({
    boardId: source.boardId,
    name: newName || `${source.name} (Copy)`,
    position: 0, // Will be calculated
    isArchived: false,
    isCollapsed: false,
  })

  // Copy cards
  const newCards = []
  for (const card of source.cards) {
    const newCard = await createCard({
      listId: newList.id,
      boardId: source.boardId,
      title: card.title,
      description: card.description,
      position: card.position,
      coverType: card.coverType,
      coverValue: card.coverValue,
      dueDate: card.dueDate,
      dueDateCompleted: false,
      isArchived: false,
    })
    newCards.push(newCard)
  }

  return {
    ...newList,
    cards: newCards,
  }
}

/**
 * Reorder lists within a board (drag-and-drop).
 */
export async function reorderLists(
  _boardId: string,
  orderedListIds: string[],
): Promise<void> {
  const updates = orderedListIds.map((id, index) => ({
    id,
    position: (index + 1) * POSITION_GAP,
  }))

  await batchUpdatePositions('lists', updates)
}

/**
 * Move a list to a specific position.
 */
export async function moveList(
  listId: string,
  boardId: string,
  targetIndex: number,
): Promise<void> {
  return moveListTransaction(listId, boardId, targetIndex)
}
