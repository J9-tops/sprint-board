/**
 * Export service - Import/export functionality for boards.
 */

import {
  addLabelToCard,
  createAttachment,
  createBoard,
  createCard,
  createChecklist,
  createChecklistItem,
  createLabel,
  createList,
  getAllBoards,
  getAttachmentsByCard,
  getBoardOrThrow,
  getCardsByBoard,
  getChecklistsByCard,
  getItemsByChecklist,
  getLabelsByBoard,
  getLabelsForCard,
  getListsByBoard,
} from '../db'
import type { Board, Card } from '../db'

// ============================================================================
// Export Types
// ============================================================================

interface ExportedChecklistItem {
  text: string
  isCompleted: boolean
  position: number
}

interface ExportedChecklist {
  name: string
  position: number
  items: Array<ExportedChecklistItem>
}

interface ExportedAttachment {
  fileName: string
  fileType: string
  fileSize: number
  fileData: string
  thumbnailData?: string
}

interface ExportedCard {
  title: string
  description: string
  position: number
  coverType: Card['coverType']
  coverValue: string
  dueDate: number | null
  labels: Array<string> // Label names
  checklists: Array<ExportedChecklist>
  attachments: Array<ExportedAttachment>
}

interface ExportedList {
  name: string
  position: number
  cards: Array<ExportedCard>
}

interface ExportedLabel {
  name: string
  color: string
}

interface ExportedBoard {
  formatVersion: number
  exportedAt: number
  name: string
  description: string
  background: string
  labels: Array<ExportedLabel>
  lists: Array<ExportedList>
}

// ============================================================================
// Export Operations
// ============================================================================

/**
 * Export a board to JSON.
 */
export async function exportBoard(boardId: string): Promise<ExportedBoard> {
  const board = await getBoardOrThrow(boardId)
  const lists = await getListsByBoard(boardId)
  const cards = await getCardsByBoard(boardId)
  const labels = await getLabelsByBoard(boardId)

  const exportedLists: Array<ExportedList> = []

  for (const list of lists.filter((l) => !l.isArchived)) {
    const listCards = cards.filter((c) => c.listId === list.id && !c.isArchived)
    const exportedCards: Array<ExportedCard> = []

    for (const card of listCards) {
      const cardLabels = await getLabelsForCard(card.id)
      const checklists = await getChecklistsByCard(card.id)
      const attachments = await getAttachmentsByCard(card.id)

      const exportedChecklists: Array<ExportedChecklist> = []
      for (const checklist of checklists) {
        const items = await getItemsByChecklist(checklist.id)
        exportedChecklists.push({
          name: checklist.name,
          position: checklist.position,
          items: items.map((item) => ({
            text: item.text,
            isCompleted: item.isCompleted,
            position: item.position,
          })),
        })
      }

      exportedCards.push({
        title: card.title,
        description: card.description,
        position: card.position,
        coverType: card.coverType,
        coverValue: card.coverValue,
        dueDate: card.dueDate,
        labels: cardLabels.map((l) => l.name),
        checklists: exportedChecklists,
        attachments: attachments.map((att) => ({
          fileName: att.fileName,
          fileType: att.fileType,
          fileSize: att.fileSize,
          fileData: att.fileData,
          thumbnailData: att.thumbnailData,
        })),
      })
    }

    exportedLists.push({
      name: list.name,
      position: list.position,
      cards: exportedCards.sort((a, b) => a.position - b.position),
    })
  }

  return {
    formatVersion: 1,
    exportedAt: Date.now(),
    name: board.name,
    description: board.description,
    background: board.background,
    labels: labels.map((l) => ({ name: l.name, color: l.color })),
    lists: exportedLists.sort((a, b) => a.position - b.position),
  }
}

/**
 * Download board as JSON file.
 */
export async function downloadBoardAsJson(boardId: string): Promise<void> {
  const exported = await exportBoard(boardId)
  const json = JSON.stringify(exported, null, 2)
  const blob = new Blob([json], { type: 'application/json' })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${exported.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export all boards.
 */
export async function exportAllBoards(): Promise<Array<ExportedBoard>> {
  const boards = await getAllBoards()
  return Promise.all(
    boards.filter((b) => !b.isArchived).map((b) => exportBoard(b.id)),
  )
}

// ============================================================================
// Import Operations
// ============================================================================

/**
 * Import a board from JSON.
 */
export async function importBoard(data: ExportedBoard): Promise<Board> {
  // Create board
  const board = await createBoard({
    name: data.name,
    description: data.description,
    background: data.background,
    isStarred: false,
    isArchived: false,
    position: 0,
    workspaceId: null,
  })

  // Create labels and map names to IDs
  const labelMap = new Map<string, string>()
  for (const labelData of data.labels) {
    const label = await createLabel({
      boardId: board.id,
      name: labelData.name,
      color: labelData.color,
    })
    labelMap.set(label.name, label.id)
  }

  // Create lists and cards
  for (const listData of data.lists) {
    const list = await createList({
      boardId: board.id,
      name: listData.name,
      position: listData.position,
      isArchived: false,
      isCollapsed: false,
    })

    for (const cardData of listData.cards) {
      const card = await createCard({
        listId: list.id,
        boardId: board.id,
        title: cardData.title,
        description: cardData.description,
        position: cardData.position,
        coverType: cardData.coverType,
        coverValue: cardData.coverValue,
        dueDate: cardData.dueDate,
        dueDateCompleted: false,
        isArchived: false,
      })

      // Add labels
      for (const labelName of cardData.labels) {
        const labelId = labelMap.get(labelName)
        if (labelId) {
          await addLabelToCard(card.id, labelId)
        }
      }

      // Create checklists and items
      for (const checklistData of cardData.checklists) {
        const checklist = await createChecklist({
          cardId: card.id,
          name: checklistData.name,
          position: checklistData.position,
        })

        for (const itemData of checklistData.items) {
          await createChecklistItem({
            checklistId: checklist.id,
            cardId: card.id,
            text: itemData.text,
            position: itemData.position,
          })
        }
      }

      // Create attachments
      for (const attData of cardData.attachments) {
        await createAttachment(
          card.id,
          attData.fileName,
          attData.fileType,
          attData.fileSize,
          attData.fileData,
          attData.thumbnailData,
        )
      }
    }
  }

  return board
}

/**
 * Import from a JSON file.
 */
export async function importFromFile(file: File): Promise<Board> {
  const text = await file.text()
  const data = JSON.parse(text) as ExportedBoard

  // Validate format version
  if (data.formatVersion !== 1) {
    throw new Error(`Unsupported format version: ${data.formatVersion}`)
  }

  return importBoard(data)
}
