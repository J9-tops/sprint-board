/**
 * Attachment database operations.
 * Single responsibility: Attachment CRUD.
 */

import {
  STORE_NAMES,
  addItem,
  getItem,
  getItemsByIndex,
  deleteItem,
  generateId,
  now,
} from '../core'
import type { Attachment } from '../types'

export async function createAttachment(
  cardId: string,
  fileName: string,
  fileType: string,
  fileSize: number,
  fileData: string,
  thumbnailData?: string,
): Promise<Attachment> {
  const attachment: Attachment = {
    id: generateId(),
    cardId,
    fileName,
    fileType,
    fileSize,
    fileData,
    thumbnailData,
    createdAt: now(),
  }

  await addItem(STORE_NAMES.ATTACHMENTS, attachment)
  return attachment
}

export async function getAttachment(
  id: string,
): Promise<Attachment | undefined> {
  return getItem<Attachment>(STORE_NAMES.ATTACHMENTS, id)
}

export async function getAttachmentsByCard(
  cardId: string,
): Promise<Attachment[]> {
  const attachments = await getItemsByIndex<Attachment>(
    STORE_NAMES.ATTACHMENTS,
    'cardId',
    cardId,
  )
  return attachments.sort((a, b) => b.createdAt - a.createdAt)
}

export async function deleteAttachment(id: string): Promise<void> {
  await deleteItem(STORE_NAMES.ATTACHMENTS, id)
}
