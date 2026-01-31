/**
 * Attachment service - Business logic for file attachments.
 * Handles file uploads, compression, and storage.
 */

import {
  FileSizeError,
  IMAGE_COMPRESSION_THRESHOLD,
  MAX_FILE_SIZE,
  createAttachment as dbCreateAttachment,
  deleteAttachment as dbDeleteAttachment,
  getAttachment,
  getAttachmentsByCard,
} from '../db'
import type { Attachment } from '../db'

// ============================================================================
// Attachment Operations
// ============================================================================

/**
 * Upload a file as an attachment.
 */
export async function uploadAttachment(
  cardId: string,
  file: File,
): Promise<Attachment> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new FileSizeError(file.size, MAX_FILE_SIZE)
  }

  // Convert file to base64
  const fileData = await fileToBase64(file)

  // Generate thumbnail for images
  let thumbnailData: string | undefined
  if (file.type.startsWith('image/')) {
    thumbnailData = await generateThumbnail(fileData, 200)
  }

  // Compress large images
  let finalFileData = fileData
  if (
    file.type.startsWith('image/') &&
    file.size > IMAGE_COMPRESSION_THRESHOLD
  ) {
    finalFileData = await compressImage(fileData, 0.8)
  }

  return dbCreateAttachment(
    cardId,
    file.name,
    file.type,
    file.size,
    finalFileData,
    thumbnailData,
  )
}

/**
 * Get an attachment by ID.
 */
export { getAttachment }

/**
 * Get all attachments for a card.
 */
export { getAttachmentsByCard }

/**
 * Delete an attachment.
 */
export async function deleteAttachment(attachmentId: string): Promise<void> {
  return dbDeleteAttachment(attachmentId)
}

/**
 * Download an attachment as a file.
 */
export async function downloadAttachment(attachmentId: string): Promise<void> {
  const attachment = await getAttachment(attachmentId)
  if (!attachment) {
    throw new Error(`Attachment ${attachmentId} not found`)
  }

  // Convert base64 to blob
  const blob = base64ToBlob(attachment.fileData, attachment.fileType)

  // Create download link
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = attachment.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Get a blob URL for viewing an attachment (e.g., images).
 */
export async function getAttachmentUrl(attachmentId: string): Promise<string> {
  const attachment = await getAttachment(attachmentId)
  if (!attachment) {
    throw new Error(`Attachment ${attachmentId} not found`)
  }

  const blob = base64ToBlob(attachment.fileData, attachment.fileType)
  return URL.createObjectURL(blob)
}

/**
 * Set an image attachment as the card cover.
 */
export async function setAsCover(
  attachmentId: string,
  cardId: string,
): Promise<void> {
  const attachment = await getAttachment(attachmentId)
  if (!attachment || !attachment.fileType.startsWith('image/')) {
    throw new Error('Attachment not found or not an image')
  }

  const { updateCard } = await import('../db')
  await updateCard(cardId, {
    coverType: 'image',
    coverValue: attachment.fileData,
  })
}

// ============================================================================
// File Utilities
// ============================================================================

/**
 * Convert a File to a base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1] || result
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * Convert a base64 string to a Blob.
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return new Blob([bytes], { type: mimeType })
}

/**
 * Generate a thumbnail for an image.
 */
export function generateThumbnail(
  base64: string,
  maxSize: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // Calculate dimensions
      let { width, height } = img
      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
      }

      // Draw to canvas
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Convert to base64
      const thumbnail = canvas.toDataURL('image/jpeg', 0.7).split(',')[1]
      resolve(thumbnail)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = `data:image/jpeg;base64,${base64}`
  })
}

/**
 * Compress an image.
 */
export function compressImage(
  base64: string,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0)

      // Convert to base64 with compression
      const compressed = canvas.toDataURL('image/jpeg', quality).split(',')[1]
      resolve(compressed)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = `data:image/jpeg;base64,${base64}`
  })
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`
}

/**
 * Get file type icon class based on MIME type.
 */
export function getFileTypeIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('pdf')) return 'pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'doc'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'sheet'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint'))
    return 'presentation'
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'archive'
  return 'file'
}
