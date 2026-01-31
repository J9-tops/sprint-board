/**
 * Storage calculation utilities.
 * Single responsibility: Storage usage calculations.
 */

import {
  STORE_NAMES,
  getAllItems,
  getItemsByIndex,
  getItemsWithFilter,
} from '../core'
import type {
  Board,
  List,
  Card,
  Label,
  Checklist,
  ChecklistItem,
  Attachment,
  StorageBreakdown,
  BoardStorageInfo,
} from '../types'

/** Get browser storage estimate */
export async function getStorageEstimate(): Promise<StorageEstimate> {
  if (!navigator.storage?.estimate) return { quota: 0, usage: 0 }
  return navigator.storage.estimate()
}

/** Calculate complete storage breakdown */
export async function calculateStorageUsage(): Promise<StorageBreakdown> {
  const estimate = await getStorageEstimate()
  const available = estimate.quota || 0
  const total = estimate.usage || 0

  const boards = await calculateDataSize()
  const attachments = await calculateAttachmentsSize()
  const archived = await calculateArchivedSize()

  return {
    total,
    boards,
    attachments,
    archived,
    available,
    percentUsed: available > 0 ? (total / available) * 100 : 0,
  }
}

/** Calculate size of non-attachment data */
async function calculateDataSize(): Promise<number> {
  const boards = await getAllItems<Board>(STORE_NAMES.BOARDS)
  const lists = await getAllItems<List>(STORE_NAMES.LISTS)
  const cards = await getItemsWithFilter<Card>(
    STORE_NAMES.CARDS,
    (c) => !c.isArchived,
  )
  const labels = await getAllItems<Label>(STORE_NAMES.LABELS)
  const checklists = await getAllItems<Checklist>(STORE_NAMES.CHECKLISTS)
  const items = await getAllItems<ChecklistItem>(STORE_NAMES.CHECKLIST_ITEMS)

  return estimateSize({ boards, lists, cards, labels, checklists, items })
}

/** Calculate total attachment size */
async function calculateAttachmentsSize(): Promise<number> {
  const attachments = await getAllItems<Attachment>(STORE_NAMES.ATTACHMENTS)
  return attachments.reduce((sum, att) => sum + (att.fileSize || 0), 0)
}

/** Calculate archived data size */
async function calculateArchivedSize(): Promise<number> {
  const archivedBoards = await getItemsWithFilter<Board>(
    STORE_NAMES.BOARDS,
    (b) => b.isArchived,
  )
  const archivedCards = await getItemsWithFilter<Card>(
    STORE_NAMES.CARDS,
    (c) => c.isArchived,
  )

  const dataSize = estimateSize({ archivedBoards, archivedCards })

  const archivedCardIds = new Set(archivedCards.map((c) => c.id))
  const allAttachments = await getAllItems<Attachment>(STORE_NAMES.ATTACHMENTS)
  const attachmentsSize = allAttachments
    .filter((att) => archivedCardIds.has(att.cardId))
    .reduce((sum, att) => sum + (att.fileSize || 0), 0)

  return dataSize + attachmentsSize
}

/** Get storage breakdown by board */
export async function getStorageByBoard(): Promise<BoardStorageInfo[]> {
  const boards = await getAllItems<Board>(STORE_NAMES.BOARDS)

  const result = await Promise.all(
    boards.map(async (board) => {
      const lists = await getItemsByIndex<List>(
        STORE_NAMES.LISTS,
        'boardId',
        board.id,
      )
      const cards = await getItemsByIndex<Card>(
        STORE_NAMES.CARDS,
        'boardId',
        board.id,
      )
      const labels = await getItemsByIndex<Label>(
        STORE_NAMES.LABELS,
        'boardId',
        board.id,
      )

      const cardIds = new Set(cards.map((c) => c.id))
      const allAttachments = await getAllItems<Attachment>(
        STORE_NAMES.ATTACHMENTS,
      )
      const attachments = allAttachments.filter((att) =>
        cardIds.has(att.cardId),
      )

      const dataSize = estimateSize({ board, lists, cards, labels })
      const attachmentSize = attachments.reduce(
        (sum, att) => sum + (att.fileSize || 0),
        0,
      )

      return {
        boardId: board.id,
        name: board.name,
        size: dataSize + attachmentSize,
        cardCount: cards.length,
        attachmentCount: attachments.length,
        lastModified: board.updatedAt,
      }
    }),
  )

  return result.sort((a, b) => b.size - a.size)
}

/** Estimate serialized size in bytes */
function estimateSize(data: unknown): number {
  try {
    return new Blob([JSON.stringify(data)]).size
  } catch {
    return 0
  }
}

/** Format bytes for display */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`
}

/** Get storage warning level */
export function getStorageWarningLevel(
  percentUsed: number,
): 'ok' | 'warning' | 'critical' {
  if (percentUsed >= 85) return 'critical'
  if (percentUsed >= 70) return 'warning'
  return 'ok'
}
