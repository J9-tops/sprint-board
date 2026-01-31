/**
 * Checklist service - Business logic for checklist management.
 */

import {
  createChecklist as dbCreateChecklist,
  getChecklist,
  getChecklistsByCard,
  updateChecklist as dbUpdateChecklist,
  deleteChecklist as dbDeleteChecklist,
  createChecklistItem as dbCreateChecklistItem,
  getChecklistItem,
  getItemsByChecklist,
  updateChecklistItem as dbUpdateChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem as dbDeleteChecklistItem,
  now,
  type Checklist,
  type ChecklistItem,
  type ChecklistWithItems,
} from '../db'

// ============================================================================
// Checklist Operations
// ============================================================================

/**
 * Create a new checklist for a card.
 */
export async function createChecklist(
  cardId: string,
  name: string,
): Promise<Checklist> {
  return dbCreateChecklist({
    cardId,
    name,
    position: 0, // Will be calculated
  })
}

/**
 * Get a checklist by ID.
 */
export { getChecklist }

/**
 * Get all checklists for a card (sorted by position).
 */
export { getChecklistsByCard }

/**
 * Get a checklist with its items.
 */
export async function getChecklistWithItems(
  checklistId: string,
): Promise<ChecklistWithItems | undefined> {
  const checklist = await getChecklist(checklistId)
  if (!checklist) return undefined

  const items = await getItemsByChecklist(checklistId)

  return {
    ...checklist,
    items: items.sort((a, b) => a.position - b.position),
  }
}

/**
 * Get all checklists with items for a card.
 */
export async function getChecklistsWithItems(
  cardId: string,
): Promise<ChecklistWithItems[]> {
  const checklists = await getChecklistsByCard(cardId)

  return Promise.all(
    checklists.map(async (checklist) => {
      const items = await getItemsByChecklist(checklist.id)
      return {
        ...checklist,
        items: items.sort((a, b) => a.position - b.position),
      }
    }),
  )
}

/**
 * Rename a checklist.
 */
export async function renameChecklist(
  checklistId: string,
  name: string,
): Promise<Checklist> {
  return dbUpdateChecklist(checklistId, { name })
}

/**
 * Delete a checklist and all its items.
 */
export async function deleteChecklist(checklistId: string): Promise<void> {
  return dbDeleteChecklist(checklistId)
}

/**
 * Copy a checklist to another card.
 */
export async function copyChecklist(
  checklistId: string,
  targetCardId: string,
  newName?: string,
): Promise<ChecklistWithItems> {
  const source = await getChecklistWithItems(checklistId)
  if (!source) {
    throw new Error(`Checklist ${checklistId} not found`)
  }

  const newChecklist = await dbCreateChecklist({
    cardId: targetCardId,
    name: newName || source.name,
    position: 0,
  })

  const newItems = []
  for (const item of source.items) {
    const newItem = await dbCreateChecklistItem({
      checklistId: newChecklist.id,
      cardId: targetCardId,
      text: item.text,
      position: item.position,
    })
    newItems.push(newItem)
  }

  return {
    ...newChecklist,
    items: newItems,
  }
}

// ============================================================================
// Checklist Item Operations
// ============================================================================

/**
 * Add an item to a checklist.
 */
export async function addChecklistItem(
  checklistId: string,
  cardId: string,
  text: string,
): Promise<ChecklistItem> {
  return dbCreateChecklistItem({
    checklistId,
    cardId,
    text,
    position: 0, // Will be calculated
  })
}

/**
 * Get a checklist item by ID.
 */
export { getChecklistItem }

/**
 * Get all items for a checklist.
 */
export { getItemsByChecklist }

/**
 * Update item text.
 */
export async function updateItemText(
  itemId: string,
  text: string,
): Promise<ChecklistItem> {
  return dbUpdateChecklistItem(itemId, { text })
}

/**
 * Toggle item completion.
 */
export { toggleChecklistItem }

/**
 * Mark item as completed.
 */
export async function completeItem(itemId: string): Promise<ChecklistItem> {
  return dbUpdateChecklistItem(itemId, {
    isCompleted: true,
    completedAt: now(),
  })
}

/**
 * Mark item as incomplete.
 */
export async function uncompleteItem(itemId: string): Promise<ChecklistItem> {
  return dbUpdateChecklistItem(itemId, {
    isCompleted: false,
    completedAt: null,
  })
}

/**
 * Delete a checklist item.
 */
export async function deleteChecklistItem(itemId: string): Promise<void> {
  return dbDeleteChecklistItem(itemId)
}

// ============================================================================
// Progress Calculations
// ============================================================================

/**
 * Calculate progress for a single checklist.
 */
export function calculateChecklistProgress(checklist: ChecklistWithItems): {
  completed: number
  total: number
  percent: number
} {
  const total = checklist.items.length
  const completed = checklist.items.filter((item) => item.isCompleted).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return { completed, total, percent }
}

/**
 * Calculate total progress for all checklists on a card.
 */
export function calculateCardChecklistProgress(
  checklists: ChecklistWithItems[],
): { completed: number; total: number; percent: number } {
  const total = checklists.reduce((sum, cl) => sum + cl.items.length, 0)
  const completed = checklists.reduce(
    (sum, cl) => sum + cl.items.filter((item) => item.isCompleted).length,
    0,
  )
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return { completed, total, percent }
}
