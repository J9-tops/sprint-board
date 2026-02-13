/**
 * Core entity type definitions for IndexedDB object stores.
 */

export interface Workspace {
  id: string
  name: string
  slug: string
  color: string
  position: number
  createdAt: number
  updatedAt: number
}

export interface Board {
  id: string
  name: string
  description: string
  background: string
  isStarred: boolean
  isArchived: boolean
  position: number
  workspaceId: string | null
  createdAt: number
  updatedAt: number
}

export interface List {
  id: string
  boardId: string
  name: string
  position: number
  isArchived: boolean
  isCollapsed: boolean
  createdAt: number
  updatedAt: number
}

export interface Card {
  id: string
  listId: string
  boardId: string
  title: string
  description: string
  position: number
  coverType: 'none' | 'color' | 'image'
  coverValue: string
  dueDate: number | null
  dueDateCompleted: boolean
  isArchived: boolean
  createdAt: number
  updatedAt: number
}

export interface Label {
  id: string
  boardId: string
  name: string
  color: string
  createdAt: number
}

export interface CardLabel {
  id: string
  cardId: string
  labelId: string
  addedAt: number
}

export interface Checklist {
  id: string
  cardId: string
  name: string
  position: number
  createdAt: number
}

export interface ChecklistItem {
  id: string
  checklistId: string
  cardId: string
  text: string
  isCompleted: boolean
  position: number
  createdAt: number
  completedAt: number | null
}

export interface Attachment {
  id: string
  cardId: string
  fileName: string
  fileType: string
  fileSize: number
  fileData: string
  thumbnailData?: string
  createdAt: number
}

export interface Setting {
  key: string
  value: unknown
  updatedAt: number
}
