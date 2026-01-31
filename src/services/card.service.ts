/**
 * Card service - Business logic for card management.
 */

import {
  POSITION_GAP,
  addLabelToCard,
  batchUpdatePositions,
  cascadeDeleteCard,
  createChecklist,
  createChecklistItem,
  archiveCard as dbArchiveCard,
  createCard as dbCreateCard,
  restoreCard as dbRestoreCard,
  updateCard as dbUpdateCard,
  getActiveCardsByList,
  getAttachmentsByCard,
  getCard,
  getCardOrThrow,
  getCardsByBoard,
  getCardsByList,
  getChecklistsByCard,
  getItemsByChecklist,
  getLabelsForCard,
  moveCardTransaction,
  quickCreateCard,
  setCardDueDate,
  toggleDueDateComplete,
} from '../db'
import type { Card, CardWithDetails, ChecklistWithItems } from '../db'

// ============================================================================
// Card Operations
// ============================================================================

/**
 * Create a new card with just a title (quick create).
 */
export async function createCard(
  listId: string,
  boardId: string,
  title: string,
): Promise<Card> {
  return quickCreateCard(listId, boardId, title)
}

/**
 * Get a card by ID.
 */
export { getCard, getCardOrThrow }

/**
 * Get cards for a list.
 */
export { getCardsByList, getActiveCardsByList }

/**
 * Get all cards for a board.
 */
export { getCardsByBoard }

/**
 * Get a card with all its related data (labels, checklists, attachments).
 */
export async function getCardWithDetails(
  cardId: string,
): Promise<CardWithDetails> {
  const card = await getCardOrThrow(cardId)
  const labels = await getLabelsForCard(cardId)
  const checklists = await getChecklistsByCard(cardId)

  // Get items for each checklist
  const checklistsWithItems: Array<ChecklistWithItems> = await Promise.all(
    checklists.map(async (checklist) => {
      const items = await getItemsByChecklist(checklist.id)
      return {
        ...checklist,
        items: items.sort((a, b) => a.position - b.position),
      }
    }),
  )

  const attachments = await getAttachmentsByCard(cardId)

  return {
    ...card,
    labels,
    checklists: checklistsWithItems,
    attachments,
  }
}

/**
 * Update card properties.
 */
export async function updateCard(
  cardId: string,
  updates: Partial<
    Pick<Card, 'title' | 'description' | 'coverType' | 'coverValue'>
  >,
): Promise<Card> {
  return dbUpdateCard(cardId, updates)
}

/**
 * Update card title.
 */
export async function updateCardTitle(
  cardId: string,
  title: string,
): Promise<Card> {
  return dbUpdateCard(cardId, { title })
}

/**
 * Update card description.
 */
export async function updateCardDescription(
  cardId: string,
  description: string,
): Promise<Card> {
  return dbUpdateCard(cardId, { description })
}

/**
 * Set card cover.
 */
export async function setCardCover(
  cardId: string,
  coverType: Card['coverType'],
  coverValue: string,
): Promise<Card> {
  return dbUpdateCard(cardId, { coverType, coverValue })
}

/**
 * Remove card cover.
 */
export async function removeCardCover(cardId: string): Promise<Card> {
  return dbUpdateCard(cardId, { coverType: 'none', coverValue: '' })
}

/**
 * Set card due date.
 */
export { setCardDueDate }

/**
 * Toggle due date completion.
 */
export { toggleDueDateComplete }

/**
 * Archive a card (soft delete).
 */
export async function archiveCard(cardId: string): Promise<Card> {
  return dbArchiveCard(cardId)
}

/**
 * Restore an archived card.
 */
export async function restoreCard(cardId: string): Promise<Card> {
  return dbRestoreCard(cardId)
}

/**
 * Delete a card permanently.
 */
export async function deleteCard(cardId: string): Promise<void> {
  return cascadeDeleteCard(cardId)
}

/**
 * Move a card to a different list or position (drag-and-drop).
 */
export async function moveCard(
  cardId: string,
  sourceListId: string,
  targetListId: string,
  targetIndex: number,
): Promise<void> {
  return moveCardTransaction(cardId, sourceListId, targetListId, targetIndex)
}

/**
 * Reorder cards within a list.
 */
export async function reorderCards(
  _listId: string,
  orderedCardIds: Array<string>,
): Promise<void> {
  const updates = orderedCardIds.map((id, index) => ({
    id,
    position: (index + 1) * POSITION_GAP,
  }))

  await batchUpdatePositions('cards', updates)
}

/**
 * Copy a card (optionally to a different list).
 */
export async function copyCard(
  cardId: string,
  targetListId?: string,
): Promise<Card> {
  const source = await getCardWithDetails(cardId)

  // Create new card
  const newCard = await dbCreateCard({
    listId: targetListId || source.listId,
    boardId: source.boardId,
    title: `${source.title} (Copy)`,
    description: source.description,
    position: 0, // Will be calculated
    coverType: source.coverType,
    coverValue: source.coverValue,
    dueDate: source.dueDate,
    dueDateCompleted: false,
    isArchived: false,
  })

  // Copy labels
  for (const label of source.labels) {
    await addLabelToCard(newCard.id, label.id)
  }

  // Copy checklists and items
  for (const checklist of source.checklists) {
    const newChecklist = await createChecklist({
      cardId: newCard.id,
      name: checklist.name,
      position: checklist.position,
    })

    for (const item of checklist.items) {
      await createChecklistItem({
        checklistId: newChecklist.id,
        cardId: newCard.id,
        text: item.text,
        position: item.position,
      })
    }
  }

  return newCard
}

/**
 * Get due date status for display.
 */
export function getDueDateStatus(
  card: Card,
): 'overdue' | 'today' | 'soon' | 'completed' | 'normal' | null {
  if (!card.dueDate) return null

  if (card.dueDateCompleted) return 'completed'

  const now = Date.now()
  const dueDate = card.dueDate
  const oneDayMs = 24 * 60 * 60 * 1000

  if (dueDate < now) return 'overdue'
  if (dueDate < now + oneDayMs) return 'today'
  if (dueDate < now + 7 * oneDayMs) return 'soon'

  return 'normal'
}
