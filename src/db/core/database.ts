/**
 * Core database initialization and connection management.
 * Single responsibility: Database lifecycle management.
 */

import { DB_NAME, DB_VERSION, STORE_NAMES } from './constants'
import { DatabaseError } from './errors'
import { generateSlug } from '@/lib/slug'

let dbInstance: IDBDatabase | null = null

/**
 * Initialize and return the IndexedDB database instance.
 */
export async function initDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    throw new Error('Cannot init DB on server')
  }

  if (dbInstance) return dbInstance

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new DatabaseError('Failed to open IndexedDB', request.error))
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = request.transaction
      const oldVersion = event.oldVersion

      createStores(db)

      if (transaction) {
        // Migration from v1 to v2: Add workspace support
        if (oldVersion < 2) {
          migrateToV2(transaction)
        }

        // Migration from v2 to v3: Add slug field to workspaces
        if (oldVersion < 3) {
          migrateToV3(transaction)
        }
      }
    }
  })
}

/**
 * Migration from v1 to v2: Add workspace support.
 * Creates a default workspace and assigns existing boards to it.
 */
function migrateToV2(transaction: IDBTransaction): void {
  // Add workspaceId index to boards store
  const boardsStore = transaction.objectStore(STORE_NAMES.BOARDS)
  if (!boardsStore.indexNames.contains('workspaceId')) {
    boardsStore.createIndex('workspaceId', 'workspaceId', { unique: false })
  }

  const workspacesStore = transaction.objectStore(STORE_NAMES.WORKSPACES)

  // Create a default workspace
  const defaultWorkspace: {
    id: string
    name: string
    color: string
    position: number
    createdAt: number
    updatedAt: number
  } = {
    id: 'default-workspace',
    name: 'My Workspace',
    color: '#0079BF',
    position: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  workspacesStore.add(defaultWorkspace)

  // Migrate all existing boards to the default workspace
  const getAllRequest = boardsStore.getAll()
  getAllRequest.onsuccess = () => {
    const boards = getAllRequest.result as Array<{
      id: string
      isStarred: boolean
      isArchived: boolean
      position: number
      createdAt: number
      updatedAt: number
      name: string
      description: string
      background: string
      workspaceId?: string | null
    }>

    boards.forEach((board) => {
      const updatedBoard = { ...board, workspaceId: defaultWorkspace.id }
      boardsStore.put(updatedBoard)
    })
  }
}

/**
 * Migration from v2 to v3: Add slug field to workspaces.
 * Generates unique slugs for all existing workspaces.
 */
function migrateToV3(transaction: IDBTransaction): void {
  const workspacesStore = transaction.objectStore(STORE_NAMES.WORKSPACES)

  if (!workspacesStore.indexNames.contains('slug')) {
    workspacesStore.createIndex('slug', 'slug', { unique: true })
  }

  const getAllRequest = workspacesStore.getAll()
  getAllRequest.onsuccess = () => {
    const workspaces = getAllRequest.result as Array<{
      id: string
      name: string
      color: string
      position: number
      createdAt: number
      updatedAt: number
    }>

    const existingSlugs: Array<string> = []

    workspaces.forEach((workspace) => {
      const slug = generateSlug(workspace.name, existingSlugs)
      existingSlugs.push(slug)

      const updatedWorkspace = {
        ...workspace,
        slug,
        updatedAt: Date.now(),
      }

      workspacesStore.put(updatedWorkspace)
    })
  }
}

/** Create all object stores and indexes */
function createStores(db: IDBDatabase): void {
  // Workspaces
  if (!db.objectStoreNames.contains(STORE_NAMES.WORKSPACES)) {
    const store = db.createObjectStore(STORE_NAMES.WORKSPACES, {
      keyPath: 'id',
    })
    store.createIndex('position', 'position', { unique: false })
    store.createIndex('slug', 'slug', { unique: true })
  }

  // Boards
  if (!db.objectStoreNames.contains(STORE_NAMES.BOARDS)) {
    const store = db.createObjectStore(STORE_NAMES.BOARDS, { keyPath: 'id' })
    store.createIndex('isStarred', 'isStarred', { unique: false })
    store.createIndex('isArchived', 'isArchived', { unique: false })
    store.createIndex('position', 'position', { unique: false })
    store.createIndex('workspaceId', 'workspaceId', { unique: false })
  }

  // Lists
  if (!db.objectStoreNames.contains(STORE_NAMES.LISTS)) {
    const store = db.createObjectStore(STORE_NAMES.LISTS, { keyPath: 'id' })
    store.createIndex('boardId', 'boardId', { unique: false })
    store.createIndex('isArchived', 'isArchived', { unique: false })
    store.createIndex('position', 'position', { unique: false })
  }

  // Cards
  if (!db.objectStoreNames.contains(STORE_NAMES.CARDS)) {
    const store = db.createObjectStore(STORE_NAMES.CARDS, { keyPath: 'id' })
    store.createIndex('listId', 'listId', { unique: false })
    store.createIndex('boardId', 'boardId', { unique: false })
    store.createIndex('dueDate', 'dueDate', { unique: false })
    store.createIndex('isArchived', 'isArchived', { unique: false })
  }

  // Labels
  if (!db.objectStoreNames.contains(STORE_NAMES.LABELS)) {
    const store = db.createObjectStore(STORE_NAMES.LABELS, { keyPath: 'id' })
    store.createIndex('boardId', 'boardId', { unique: false })
  }

  // CardLabels
  if (!db.objectStoreNames.contains(STORE_NAMES.CARD_LABELS)) {
    const store = db.createObjectStore(STORE_NAMES.CARD_LABELS, {
      keyPath: 'id',
    })
    store.createIndex('cardId', 'cardId', { unique: false })
    store.createIndex('labelId', 'labelId', { unique: false })
  }

  // Checklists
  if (!db.objectStoreNames.contains(STORE_NAMES.CHECKLISTS)) {
    const store = db.createObjectStore(STORE_NAMES.CHECKLISTS, {
      keyPath: 'id',
    })
    store.createIndex('cardId', 'cardId', { unique: false })
  }

  // ChecklistItems
  if (!db.objectStoreNames.contains(STORE_NAMES.CHECKLIST_ITEMS)) {
    const store = db.createObjectStore(STORE_NAMES.CHECKLIST_ITEMS, {
      keyPath: 'id',
    })
    store.createIndex('checklistId', 'checklistId', { unique: false })
    store.createIndex('cardId', 'cardId', { unique: false })
  }

  // Attachments
  if (!db.objectStoreNames.contains(STORE_NAMES.ATTACHMENTS)) {
    const store = db.createObjectStore(STORE_NAMES.ATTACHMENTS, {
      keyPath: 'id',
    })
    store.createIndex('cardId', 'cardId', { unique: false })
  }

  // Settings
  if (!db.objectStoreNames.contains(STORE_NAMES.SETTINGS)) {
    db.createObjectStore(STORE_NAMES.SETTINGS, { keyPath: 'key' })
  }
}

/** Get the database instance, initializing if needed */
export async function getDB(): Promise<IDBDatabase> {
  if (!dbInstance) return initDB()
  return dbInstance
}

/** Close the database connection */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

/** Delete the entire database */
export async function deleteDatabase(): Promise<void> {
  closeDB()
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME)
    request.onsuccess = () => resolve()
    request.onerror = () =>
      reject(new DatabaseError('Failed to delete database', request.error))
  })
}
