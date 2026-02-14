/**
 * Cascade delete operations for atomic deletion of related data.
 * Single responsibility: Multi-entity deletion transactions.
 */

import { STORE_NAMES, runTransaction, txDeleteByIndex, txGetAll } from '../core'
import type { Card } from '../types'

/**
 * Delete a board with all related data.
 */
export async function cascadeDeleteBoard(boardId: string): Promise<void> {
  const storeNames = [
    STORE_NAMES.BOARDS,
    STORE_NAMES.LISTS,
    STORE_NAMES.CARDS,
    STORE_NAMES.LABELS,
    STORE_NAMES.CARD_LABELS,
    STORE_NAMES.CHECKLISTS,
    STORE_NAMES.CHECKLIST_ITEMS,
    STORE_NAMES.ATTACHMENTS,
  ]

  return runTransaction(storeNames, 'readwrite', async (stores) => {
    // Get all cards in board
    const cardIndex = stores[STORE_NAMES.CARDS].index('boardId')
    const cards = await txGetAll<Card>(cardIndex, boardId)

    // Delete all card-related data
    for (const card of cards) {
      deleteCardData(stores, card.id)
      stores[STORE_NAMES.CARDS].delete(card.id)
    }

    // Delete lists, labels, and board
    txDeleteByIndex(stores[STORE_NAMES.LISTS], 'boardId', boardId)
    txDeleteByIndex(stores[STORE_NAMES.LABELS], 'boardId', boardId)
    stores[STORE_NAMES.BOARDS].delete(boardId)
  })
}

/**
 * Delete a list with all its cards and related data.
 */
export async function cascadeDeleteList(listId: string): Promise<void> {
  const storeNames = [
    STORE_NAMES.LISTS,
    STORE_NAMES.CARDS,
    STORE_NAMES.CARD_LABELS,
    STORE_NAMES.CHECKLISTS,
    STORE_NAMES.CHECKLIST_ITEMS,
    STORE_NAMES.ATTACHMENTS,
  ]

  return runTransaction(storeNames, 'readwrite', async (stores) => {
    // Get all cards in list
    const cardIndex = stores[STORE_NAMES.CARDS].index('listId')
    const cards = await txGetAll<Card>(cardIndex, listId)

    // Delete card data
    for (const card of cards) {
      deleteCardData(stores, card.id)
      stores[STORE_NAMES.CARDS].delete(card.id)
    }

    stores[STORE_NAMES.LISTS].delete(listId)
  })
}

/**
 * Delete a card with all related data.
 */
export async function cascadeDeleteCard(cardId: string): Promise<void> {
  const storeNames = [
    STORE_NAMES.CARDS,
    STORE_NAMES.CARD_LABELS,
    STORE_NAMES.CHECKLISTS,
    STORE_NAMES.CHECKLIST_ITEMS,
    STORE_NAMES.ATTACHMENTS,
  ]

  return runTransaction(storeNames, 'readwrite', (stores) => {
    deleteCardData(stores, cardId)
    stores[STORE_NAMES.CARDS].delete(cardId)
    return Promise.resolve()
  })
}

/** Helper to delete all data related to a card */
function deleteCardData(
  stores: Record<string, IDBObjectStore>,
  cardId: string,
): void {
  txDeleteByIndex(stores[STORE_NAMES.CARD_LABELS], 'cardId', cardId)
  txDeleteByIndex(stores[STORE_NAMES.CHECKLISTS], 'cardId', cardId)
  txDeleteByIndex(stores[STORE_NAMES.CHECKLIST_ITEMS], 'cardId', cardId)
  txDeleteByIndex(stores[STORE_NAMES.ATTACHMENTS], 'cardId', cardId)
}
