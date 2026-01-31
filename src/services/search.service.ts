/**
 * Search service - Full-text search across cards and boards.
 */

import {
  searchCards as dbSearchCards,
  getOverdueCards,
  getCardsDueSoon,
  getAllBoards,
  getActiveBoards,
  getLabelsForCard,
  getItemsWithFilter,
  getAttachmentsByCard,
  STORE_NAMES,
  type Card,
  type Board,
} from '../db'

// ============================================================================
// Search Types
// ============================================================================

export interface SearchResult {
  type: 'card' | 'board'
  id: string
  title: string
  description?: string
  boardId: string
  boardName: string
  matchedField: 'title' | 'description'
  snippet?: string
}

export interface SearchFilters {
  labels?: string[]
  dueDateStatus?: 'overdue' | 'soon' | 'none'
  hasAttachments?: boolean
  hasChecklist?: boolean
}

// ============================================================================
// Search Operations
// ============================================================================

/**
 * Search cards across all boards or a specific board.
 */
export async function searchCards(
  query: string,
  boardId?: string,
): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const cards = await dbSearchCards(query, boardId)
  const boards = await getAllBoards()
  const boardMap = new Map(boards.map((b) => [b.id, b.name]))
  const lowerQuery = query.toLowerCase()

  return cards.map((card) => {
    const matchedField = card.title.toLowerCase().includes(lowerQuery)
      ? 'title'
      : 'description'

    return {
      type: 'card' as const,
      id: card.id,
      title: card.title,
      description: card.description,
      boardId: card.boardId,
      boardName: boardMap.get(card.boardId) || 'Unknown',
      matchedField,
      snippet: createSnippet(
        matchedField === 'title' ? card.title : card.description,
        query,
      ),
    }
  })
}

/**
 * Search boards by name.
 */
export async function searchBoards(query: string): Promise<Board[]> {
  if (!query.trim()) return []

  const boards = await getActiveBoards()
  const lowerQuery = query.toLowerCase()

  return boards.filter(
    (board) =>
      board.name.toLowerCase().includes(lowerQuery) ||
      board.description.toLowerCase().includes(lowerQuery),
  )
}

/**
 * Combined search across cards and boards.
 */
export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const [cardResults, boards] = await Promise.all([
    searchCards(query),
    searchBoards(query),
  ])

  const boardResults: SearchResult[] = boards.map((board) => ({
    type: 'board' as const,
    id: board.id,
    title: board.name,
    description: board.description,
    boardId: board.id,
    boardName: board.name,
    matchedField: 'title' as const,
  }))

  // Boards first, then cards
  return [...boardResults, ...cardResults]
}

// ============================================================================
// Filtered Queries
// ============================================================================

/**
 * Get cards that are overdue.
 */
export { getOverdueCards }

/**
 * Get cards due soon (within specified hours).
 */
export { getCardsDueSoon }

/**
 * Get cards with specific labels.
 */
export async function getCardsWithLabels(
  labelIds: string[],
  boardId?: string,
): Promise<Card[]> {
  const cards = await getItemsWithFilter<Card>(STORE_NAMES.CARDS, (card) => {
    if (card.isArchived) return false
    if (boardId && card.boardId !== boardId) return false
    return true
  })

  const matching: Card[] = []

  for (const card of cards) {
    const labels = await getLabelsForCard(card.id)
    const cardLabelIds = labels.map((l) => l.id)

    if (labelIds.some((id) => cardLabelIds.includes(id))) {
      matching.push(card)
    }
  }

  return matching
}

/**
 * Get cards with attachments.
 */
export async function getCardsWithAttachments(
  boardId?: string,
): Promise<Card[]> {
  const cards = await getItemsWithFilter<Card>(STORE_NAMES.CARDS, (card) => {
    if (card.isArchived) return false
    if (boardId && card.boardId !== boardId) return false
    return true
  })

  const withAttachments: Card[] = []

  for (const card of cards) {
    const attachments = await getAttachmentsByCard(card.id)
    if (attachments.length > 0) {
      withAttachments.push(card)
    }
  }

  return withAttachments
}

/**
 * Get recently modified cards.
 */
export async function getRecentlyModifiedCards(
  limit: number = 10,
): Promise<Card[]> {
  const cards = await getItemsWithFilter<Card>(
    STORE_NAMES.CARDS,
    (card) => !card.isArchived,
  )

  return cards.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, limit)
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a snippet around the matched text.
 */
function createSnippet(
  text: string,
  query: string,
  contextLength: number = 50,
): string {
  if (!text) return ''

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) return text.slice(0, contextLength * 2) + '...'

  const start = Math.max(0, index - contextLength)
  const end = Math.min(text.length, index + query.length + contextLength)

  let snippet = text.slice(start, end)

  if (start > 0) snippet = '...' + snippet
  if (end < text.length) snippet = snippet + '...'

  return snippet
}

/**
 * Highlight matched text in a string.
 */
export function highlightMatch(
  text: string,
  query: string,
): { text: string; isMatch: boolean }[] {
  if (!query.trim()) return [{ text, isMatch: false }]

  const parts: { text: string; isMatch: boolean }[] = []
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()

  let lastIndex = 0
  let index = lowerText.indexOf(lowerQuery)

  while (index !== -1) {
    // Add non-matching text before match
    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), isMatch: false })
    }

    // Add matching text
    parts.push({
      text: text.slice(index, index + query.length),
      isMatch: true,
    })

    lastIndex = index + query.length
    index = lowerText.indexOf(lowerQuery, lastIndex)
  }

  // Add remaining non-matching text
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isMatch: false })
  }

  return parts
}
