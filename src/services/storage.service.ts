/**
 * Storage service - Business logic for storage management.
 */

import {
  calculateStorageUsage,
  cascadeDeleteBoard,
  cascadeDeleteCard,
  formatBytes,
  getArchivedBoards,
  getStorageByBoard,
  getStorageWarningLevel,
} from '../db'
import type { BoardStorageInfo, Card, StorageBreakdown } from '../db'

// Re-export utility functions
export { formatBytes, getStorageWarningLevel }

// ============================================================================
// Storage Overview
// ============================================================================

/**
 * Get complete storage breakdown.
 */
export async function getStorageOverview(): Promise<StorageBreakdown> {
  return calculateStorageUsage()
}

/**
 * Get storage usage by board.
 */
export async function getBoardStorageBreakdown(): Promise<
  Array<BoardStorageInfo>
> {
  return getStorageByBoard()
}

// ============================================================================
// Storage Analysis
// ============================================================================

interface StorageAnalysis {
  overview: StorageBreakdown
  warningLevel: 'ok' | 'warning' | 'critical'
  largestBoards: Array<BoardStorageInfo>
  recommendations: Array<string>
}

/**
 * Get comprehensive storage analysis with recommendations.
 */
export async function analyzeStorage(): Promise<StorageAnalysis> {
  const overview = await calculateStorageUsage()
  const warningLevel = getStorageWarningLevel(overview.percentUsed)
  const boardStorage = await getStorageByBoard()

  const recommendations: Array<string> = []

  // Generate recommendations
  if (warningLevel === 'critical') {
    recommendations.push(
      'Storage is critically low. Consider deleting unused boards or attachments.',
    )
  } else if (warningLevel === 'warning') {
    recommendations.push(
      'Storage is getting low. Review and clean up old data.',
    )
  }

  if (overview.archived > 1024 * 1024) {
    recommendations.push(
      `You have ${formatBytes(overview.archived)} of archived data. Consider permanently deleting it.`,
    )
  }

  return {
    overview,
    warningLevel,
    largestBoards: boardStorage.slice(0, 5),
    recommendations,
  }
}

// ============================================================================
// Cleanup Operations
// ============================================================================

/**
 * Delete all archived boards permanently.
 */
export async function deleteArchivedBoards(): Promise<number> {
  const archived = await getArchivedBoards()

  for (const board of archived) {
    await cascadeDeleteBoard(board.id)
  }

  return archived.length
}

/**
 * Delete all archived cards permanently.
 */
export async function deleteArchivedCards(): Promise<number> {
  // Import from db/core to get low-level filter
  const { getItemsWithFilter, STORE_NAMES } = await import('../db/core')

  const archived = await getItemsWithFilter<Card>(
    STORE_NAMES.CARDS,
    (c: Card) => c.isArchived,
  )

  for (const card of archived) {
    await cascadeDeleteCard(card.id)
  }

  return archived.length
}

/**
 * Compress all uncompressed images.
 * Note: This is a placeholder - actual implementation requires image processing.
 */
export async function compressAllImages(): Promise<{
  count: number
  savedBytes: number
}> {
  // TODO: Implement actual image compression when needed
  return { count: 0, savedBytes: 0 }
}
