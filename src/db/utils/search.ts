/**
 * Search and query utilities.
 * Single responsibility: Search and filter operations.
 */

import { STORE_NAMES, getItemsWithFilter, now } from '../core'
import type { Card } from '../types'

/** Search cards by title or description */
export async function searchCards(
  query: string,
  boardId?: string,
): Promise<Card[]> {
  const lowerQuery = query.toLowerCase()

  return getItemsWithFilter<Card>(STORE_NAMES.CARDS, (card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(lowerQuery) ||
      card.description.toLowerCase().includes(lowerQuery)
    const matchesBoard = boardId ? card.boardId === boardId : true
    return matchesSearch && matchesBoard && !card.isArchived
  })
}

/** Get overdue cards */
export async function getOverdueCards(): Promise<Card[]> {
  const currentTime = now()
  return getItemsWithFilter<Card>(STORE_NAMES.CARDS, (card) => {
    return (
      card.dueDate !== null &&
      card.dueDate < currentTime &&
      !card.dueDateCompleted &&
      !card.isArchived
    )
  })
}

/** Get cards due soon */
export async function getCardsDueSoon(
  hoursAhead: number = 24,
): Promise<Card[]> {
  const currentTime = now()
  const futureTime = currentTime + hoursAhead * 60 * 60 * 1000

  return getItemsWithFilter<Card>(STORE_NAMES.CARDS, (card) => {
    return (
      card.dueDate !== null &&
      card.dueDate >= currentTime &&
      card.dueDate <= futureTime &&
      !card.dueDateCompleted &&
      !card.isArchived
    )
  })
}
