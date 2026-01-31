/**
 * Batch position update operations for drag-and-drop.
 * Single responsibility: Position batch updates and item movement.
 */

import {
  STORE_NAMES,
  runTransaction,
  txGet,
  txGetAll,
  calculateInsertPosition,
  needsNormalization,
  normalizePositions,
} from '../core'
import type { Card, List, PositionUpdate } from '../types'

/**
 * Batch update positions for multiple items.
 */
export async function batchUpdatePositions(
  storeName: string,
  updates: PositionUpdate[],
): Promise<void> {
  if (updates.length === 0) return

  return runTransaction([storeName], 'readwrite', async (stores) => {
    const store = stores[storeName]

    for (const { id, position } of updates) {
      const item = await txGet<{ position: number; updatedAt?: number }>(
        store,
        id,
      )
      if (item) {
        item.position = position
        if ('updatedAt' in item) item.updatedAt = Date.now()
        store.put(item)
      }
    }
  })
}

/**
 * Move a card between lists or within the same list.
 */
export async function moveCardTransaction(
  cardId: string,
  sourceListId: string,
  targetListId: string,
  targetIndex: number,
): Promise<void> {
  const isSameList = sourceListId === targetListId

  return runTransaction([STORE_NAMES.CARDS], 'readwrite', async (stores) => {
    const cardStore = stores[STORE_NAMES.CARDS]

    const card = await txGet<Card>(cardStore, cardId)
    if (!card) throw new Error(`Card ${cardId} not found`)

    // Get cards in target list
    const targetIdx = cardStore.index('listId')
    const targetCards = await txGetAll<Card>(targetIdx, targetListId)
    const otherCards = isSameList
      ? targetCards.filter((c) => c.id !== cardId)
      : targetCards

    // Calculate and update position
    const newPosition = calculateInsertPosition(otherCards, targetIndex)
    const updatedCard: Card = {
      ...card,
      listId: targetListId,
      position: newPosition,
      updatedAt: Date.now(),
    }
    cardStore.put(updatedCard)

    // Normalize if needed
    const allCards = isSameList
      ? [...otherCards, updatedCard]
      : [...targetCards, updatedCard]

    if (needsNormalization(allCards)) {
      await normalizeStorePositions(cardStore, allCards)
    }
  })
}

/**
 * Move a list to a new position within a board.
 */
export async function moveListTransaction(
  listId: string,
  boardId: string,
  targetIndex: number,
): Promise<void> {
  return runTransaction([STORE_NAMES.LISTS], 'readwrite', async (stores) => {
    const listStore = stores[STORE_NAMES.LISTS]

    const list = await txGet<List>(listStore, listId)
    if (!list) throw new Error(`List ${listId} not found`)

    // Get other lists in board
    const boardIndex = listStore.index('boardId')
    const boardLists = await txGetAll<List>(boardIndex, boardId)
    const otherLists = boardLists.filter((l) => l.id !== listId)

    // Calculate and update position
    const newPosition = calculateInsertPosition(otherLists, targetIndex)
    const updatedList: List = {
      ...list,
      position: newPosition,
      updatedAt: Date.now(),
    }
    listStore.put(updatedList)

    // Normalize if needed
    const allLists = [...otherLists, updatedList]
    if (needsNormalization(allLists)) {
      await normalizeStorePositions(listStore, allLists)
    }
  })
}

/** Helper to normalize positions within a transaction */
async function normalizeStorePositions(
  store: IDBObjectStore,
  items: Array<{ id: string; position: number }>,
): Promise<void> {
  const normalized = normalizePositions(items)

  for (const { id, position } of normalized) {
    const item = await txGet<{ position: number; updatedAt?: number }>(
      store,
      id,
    )
    if (item) {
      item.position = position
      if ('updatedAt' in item) item.updatedAt = Date.now()
      store.put(item)
    }
  }
}
