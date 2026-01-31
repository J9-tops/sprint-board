/**
 * List database operations.
 * Single responsibility: List CRUD operations.
 */

import {
  POSITION_GAP,
  STORE_NAMES,
  addItem,
  generateId,
  getItem,
  getItemOrThrow,
  getItemsByIndex,
  now,
  updateItem,
} from '../core'
import type { CreateListInput, List } from '../types'

export async function createList(data: CreateListInput): Promise<List> {
  const existing = await getListsByBoard(data.boardId)
  const maxPosition =
    existing.length > 0 ? Math.max(...existing.map((l) => l.position)) : 0

  const list: List = {
    ...data,
    id: generateId(),
    position: maxPosition + POSITION_GAP,
    createdAt: now(),
    updatedAt: now(),
  }

  await addItem(STORE_NAMES.LISTS, list)
  return list
}

export async function getList(id: string): Promise<List | undefined> {
  return getItem<List>(STORE_NAMES.LISTS, id)
}

export async function getListOrThrow(id: string): Promise<List> {
  return getItemOrThrow<List>(STORE_NAMES.LISTS, id, 'List')
}

export async function getListsByBoard(boardId: string): Promise<Array<List>> {
  const lists = await getItemsByIndex<List>(
    STORE_NAMES.LISTS,
    'boardId',
    boardId,
  )
  return lists.sort((a, b) => a.position - b.position)
}

export async function getActiveListsByBoard(
  boardId: string,
): Promise<Array<List>> {
  const lists = await getListsByBoard(boardId)
  return lists.filter((l) => !l.isArchived)
}

export async function updateList(
  id: string,
  updates: Partial<List>,
): Promise<List> {
  return updateItem<List>(STORE_NAMES.LISTS, id, {
    ...updates,
    updatedAt: now(),
  })
}

export async function archiveList(id: string): Promise<List> {
  return updateList(id, { isArchived: true })
}

export async function restoreList(id: string): Promise<List> {
  return updateList(id, { isArchived: false })
}

export async function toggleListCollapse(id: string): Promise<List> {
  const list = await getListOrThrow(id)
  return updateList(id, { isCollapsed: !list.isCollapsed })
}
