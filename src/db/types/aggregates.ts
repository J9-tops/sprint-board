/**
 * Aggregated types for complex data structures and filters.
 */

import type {
  Board,
  List,
  Card,
  Label,
  Checklist,
  ChecklistItem,
  Attachment,
} from './entities'

/** Card with all related data */
export interface CardWithDetails extends Card {
  labels: Label[]
  checklists: ChecklistWithItems[]
  attachments: Attachment[]
}

/** Checklist with its items */
export interface ChecklistWithItems extends Checklist {
  items: ChecklistItem[]
}

/** Board with all related data */
export interface BoardWithData extends Board {
  lists: ListWithCards[]
  labels: Label[]
}

/** List with its cards */
export interface ListWithCards extends List {
  cards: Card[]
}

/** Card filter options */
export interface CardFilters {
  labels?: string[]
  dueDateStatus?: 'none' | 'overdue' | 'today' | 'week' | 'completed'
  hasChecklist?: boolean
  checklistComplete?: boolean
}

/** Storage breakdown statistics */
export interface StorageBreakdown {
  total: number
  boards: number
  attachments: number
  archived: number
  available: number
  percentUsed: number
}

/** Storage info for a single board */
export interface BoardStorageInfo {
  boardId: string
  name: string
  size: number
  cardCount: number
  attachmentCount: number
  lastModified: number
}
