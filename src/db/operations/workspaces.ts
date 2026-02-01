/**
 * Workspace database operations.
 * Single responsibility: Workspace CRUD operations.
 */

import {
  POSITION_GAP,
  STORE_NAMES,
  addItem,
  generateId,
  getAllItems,
  getItem,
  getItemOrThrow,
  now,
  updateItem,
} from '../core'
import type { CreateWorkspaceInput, Workspace } from '../types'

export async function createWorkspace(
  data: CreateWorkspaceInput,
): Promise<Workspace> {
  const existing = await getAllWorkspaces()
  const maxPosition =
    existing.length > 0 ? Math.max(...existing.map((ws) => ws.position)) : 0

  const workspace: Workspace = {
    ...data,
    id: generateId(),
    position: maxPosition + POSITION_GAP,
    createdAt: now(),
    updatedAt: now(),
  }

  await addItem(STORE_NAMES.WORKSPACES, workspace)
  return workspace
}

export async function getWorkspace(id: string): Promise<Workspace | undefined> {
  return getItem<Workspace>(STORE_NAMES.WORKSPACES, id)
}

export async function getWorkspaceOrThrow(id: string): Promise<Workspace> {
  return getItemOrThrow<Workspace>(STORE_NAMES.WORKSPACES, id, 'Workspace')
}

export async function getAllWorkspaces(): Promise<Array<Workspace>> {
  const workspaces = await getAllItems<Workspace>(STORE_NAMES.WORKSPACES)
  return workspaces.sort((a, b) => a.position - b.position)
}

export async function updateWorkspace(
  id: string,
  updates: Partial<Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Workspace> {
  return updateItem<Workspace>(STORE_NAMES.WORKSPACES, id, {
    ...updates,
    updatedAt: now(),
  })
}

export async function deleteWorkspace(id: string): Promise<void> {
  const db = await (await import('../core')).getDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAMES.WORKSPACES, 'readwrite')
    const store = transaction.objectStore(STORE_NAMES.WORKSPACES)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () =>
      reject(new Error(`Failed to delete workspace with id ${id}`))
  })
}
