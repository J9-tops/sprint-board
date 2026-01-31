/**
 * Checklist database operations.
 * Single responsibility: Checklist and item CRUD.
 */

import {
  POSITION_GAP,
  STORE_NAMES,
  addItem,
  deleteItem,
  deleteItemsByIndex,
  generateId,
  getItem,
  getItemOrThrow,
  getItemsByIndex,
  now,
  updateItem,
} from '../core'
import type {
  Checklist,
  ChecklistItem,
  CreateChecklistInput,
  CreateChecklistItemInput,
} from '../types'

export async function createChecklist(
  data: CreateChecklistInput,
): Promise<Checklist> {
  const existing = await getChecklistsByCard(data.cardId)
  const maxPosition =
    existing.length > 0 ? Math.max(...existing.map((c) => c.position)) : 0

  const checklist: Checklist = {
    ...data,
    id: generateId(),
    position: maxPosition + POSITION_GAP,
    createdAt: now(),
  }

  await addItem(STORE_NAMES.CHECKLISTS, checklist)
  return checklist
}

export async function getChecklist(id: string): Promise<Checklist | undefined> {
  return getItem<Checklist>(STORE_NAMES.CHECKLISTS, id)
}

export async function getChecklistsByCard(
  cardId: string,
): Promise<Array<Checklist>> {
  const checklists = await getItemsByIndex<Checklist>(
    STORE_NAMES.CHECKLISTS,
    'cardId',
    cardId,
  )
  return checklists.sort((a, b) => a.position - b.position)
}

export async function updateChecklist(
  id: string,
  updates: Partial<Checklist>,
): Promise<Checklist> {
  return updateItem<Checklist>(STORE_NAMES.CHECKLISTS, id, updates)
}

export async function deleteChecklist(id: string): Promise<void> {
  await deleteItemsByIndex(STORE_NAMES.CHECKLIST_ITEMS, 'checklistId', id)
  await deleteItem(STORE_NAMES.CHECKLISTS, id)
}

// Checklist Items

export async function createChecklistItem(
  data: CreateChecklistItemInput,
): Promise<ChecklistItem> {
  const existing = await getItemsByChecklist(data.checklistId)
  const maxPosition =
    existing.length > 0 ? Math.max(...existing.map((i) => i.position)) : 0

  const item: ChecklistItem = {
    ...data,
    id: generateId(),
    isCompleted: false,
    position: maxPosition + POSITION_GAP,
    createdAt: now(),
    completedAt: null,
  }

  await addItem(STORE_NAMES.CHECKLIST_ITEMS, item)
  return item
}

export async function getChecklistItem(
  id: string,
): Promise<ChecklistItem | undefined> {
  return getItem<ChecklistItem>(STORE_NAMES.CHECKLIST_ITEMS, id)
}

export async function getItemsByChecklist(
  checklistId: string,
): Promise<Array<ChecklistItem>> {
  const items = await getItemsByIndex<ChecklistItem>(
    STORE_NAMES.CHECKLIST_ITEMS,
    'checklistId',
    checklistId,
  )
  return items.sort((a, b) => a.position - b.position)
}

export async function updateChecklistItem(
  id: string,
  updates: Partial<ChecklistItem>,
): Promise<ChecklistItem> {
  return updateItem<ChecklistItem>(STORE_NAMES.CHECKLIST_ITEMS, id, updates)
}

export async function toggleChecklistItem(id: string): Promise<ChecklistItem> {
  const item = await getItemOrThrow<ChecklistItem>(
    STORE_NAMES.CHECKLIST_ITEMS,
    id,
    'ChecklistItem',
  )

  return updateChecklistItem(id, {
    isCompleted: !item.isCompleted,
    completedAt: !item.isCompleted ? now() : null,
  })
}

export async function deleteChecklistItem(id: string): Promise<void> {
  await deleteItem(STORE_NAMES.CHECKLIST_ITEMS, id)
}
