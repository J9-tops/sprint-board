/**
 * Position management utilities for ordering items.
 * Single responsibility: Position calculations.
 */

import { POSITION_GAP } from './constants'
import type { PositionUpdate } from '../types'

/**
 * Calculate position for inserting at a specific index.
 * Uses fractional positioning to avoid reordering all items.
 */
export function calculateInsertPosition(
  items: Array<{ position: number }>,
  targetIndex: number,
): number {
  if (items.length === 0) return POSITION_GAP

  const sorted = [...items].sort((a, b) => a.position - b.position)

  // Insert at beginning
  if (targetIndex <= 0) {
    return Math.floor(sorted[0].position / 2)
  }

  // Insert at end
  if (targetIndex >= sorted.length) {
    return sorted[sorted.length - 1].position + POSITION_GAP
  }

  // Insert between two items
  const before = sorted[targetIndex - 1].position
  const after = sorted[targetIndex].position
  return Math.floor((before + after) / 2)
}

/**
 * Check if positions need normalization (gaps too small).
 */
export function needsNormalization(
  items: Array<{ position: number }>,
): boolean {
  if (items.length < 2) return false

  const sorted = [...items].sort((a, b) => a.position - b.position)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].position - sorted[i - 1].position < 2) {
      return true
    }
  }
  return false
}

/**
 * Normalize positions with equal gaps.
 */
export function normalizePositions(
  items: Array<{ id: string; position: number }>,
): Array<PositionUpdate> {
  const sorted = [...items].sort((a, b) => a.position - b.position)
  return sorted.map((item, index) => ({
    id: item.id,
    position: (index + 1) * POSITION_GAP,
  }))
}
