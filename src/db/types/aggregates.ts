/**
 * Aggregated types for complex data structures and filters.
 */

import type {
  Attachment,
  Board,
  Card,
  Checklist,
  ChecklistItem,
  Label,
  List,
} from './entities'

/** Card with all related data */
export interface CardWithDetails extends Card {
  labels: Array<Label>
  checklists: Array<ChecklistWithItems>
  attachments: Array<Attachment>
}

/** Checklist with its items */
export interface ChecklistWithItems extends Checklist {
  items: Array<ChecklistItem>
}

/** Board with all related data */
export interface BoardWithData extends Board {
  lists: Array<ListWithCards>
  labels: Array<Label>
}

/** List with its cards */
export interface ListWithCards extends List {
  cards: Array<Card>
}

/** Card filter options */
export interface CardFilters {
  labels?: Array<string>
  dueDateStatus?: 'none' | 'overdue' | 'today' | 'week' | 'completed'
  hasChecklist?: boolean
  checklistComplete?: boolean
}

/** Storage breakdown statistics */
export interface StorageBreakdown {
  total: number
  boards: number
  boardCount: number
  attachments: number
  attachmentCount: number
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
