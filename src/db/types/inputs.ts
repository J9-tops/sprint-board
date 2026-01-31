/**
 * Input types for creating and updating entities.
 */

import type {
  Board,
  Card,
  Checklist,
  ChecklistItem,
  Label,
  List,
} from './entities'

/** Input type for creating entities (omits auto-generated fields) */
export type CreateBoardInput = Omit<Board, 'id' | 'createdAt' | 'updatedAt'>
export type CreateListInput = Omit<List, 'id' | 'createdAt' | 'updatedAt'>
export type CreateCardInput = Omit<Card, 'id' | 'createdAt' | 'updatedAt'>
export type CreateLabelInput = Omit<Label, 'id' | 'createdAt'>
export type CreateChecklistInput = Omit<Checklist, 'id' | 'createdAt'>
export type CreateChecklistItemInput = Omit<
  ChecklistItem,
  'id' | 'createdAt' | 'completedAt' | 'isCompleted'
>

/** Input type for updating entities (partial with required id) */
export type UpdateInput<T extends { id: string }> = Partial<Omit<T, 'id'>> & {
  id: string
}

/** Position update for batch reordering operations */
export interface PositionUpdate {
  id: string
  position: number
}
