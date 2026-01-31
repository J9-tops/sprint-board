/**
 * Label service - Business logic for label management.
 */

import {
  LABEL_COLORS,
  addLabelToCard,
  createLabel as dbCreateLabel,
  deleteLabel as dbDeleteLabel,
  updateLabel as dbUpdateLabel,
  getCardsWithLabel,
  getLabel,
  getLabelsByBoard,
  getLabelsForCard,
  removeLabelFromCard,
  toggleLabelOnCard,
} from '../db'
import type { Label, LabelColor } from '../db'

// ============================================================================
// Label Operations
// ============================================================================

/**
 * Create a new label for a board.
 */
export async function createLabel(
  boardId: string,
  name: string,
  color: LabelColor = 'blue',
): Promise<Label> {
  return dbCreateLabel({
    boardId,
    name,
    color,
  })
}

/**
 * Get a label by ID.
 */
export { getLabel }

/**
 * Get all labels for a board.
 */
export { getLabelsByBoard }

/**
 * Get labels for a card.
 */
export { getLabelsForCard }

/**
 * Get cards that have a specific label.
 */
export { getCardsWithLabel }

/**
 * Update label properties.
 */
export async function updateLabel(
  labelId: string,
  updates: Partial<Pick<Label, 'name' | 'color'>>,
): Promise<Label> {
  return dbUpdateLabel(labelId, updates)
}

/**
 * Delete a label (removes it from all cards too).
 */
export async function deleteLabel(labelId: string): Promise<void> {
  return dbDeleteLabel(labelId)
}

/**
 * Add a label to a card.
 */
export { addLabelToCard }

/**
 * Remove a label from a card.
 */
export { removeLabelFromCard }

/**
 * Toggle label on a card.
 */
export { toggleLabelOnCard }

/**
 * Get available label colors.
 */
export function getAvailableColors(): ReadonlyArray<LabelColor> {
  return LABEL_COLORS
}

/**
 * Get a suggested color for a new label (one that's not heavily used).
 */
export async function getSuggestedColor(boardId: string): Promise<LabelColor> {
  const existingLabels = await getLabelsByBoard(boardId)
  const usedColors = new Set(existingLabels.map((l) => l.color))

  // Return first unused color, or 'blue' if all are used
  for (const color of LABEL_COLORS) {
    if (!usedColors.has(color)) {
      return color
    }
  }

  return 'blue'
}
