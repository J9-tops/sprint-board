/**
 * Core database initialization and connection management.
 * Single responsibility: Database lifecycle management.
 */

import { DB_NAME, DB_VERSION, STORE_NAMES } from './constants'
import { DatabaseError } from './errors'

let dbInstance: IDBDatabase | null = null

/**
 * Initialize and return the IndexedDB database instance.
 */
export async function initDB(): Promise<IDBDatabase> {
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
      createStores(db)
    }
  })
}

/** Create all object stores and indexes */
function createStores(db: IDBDatabase): void {
  // Boards
  if (!db.objectStoreNames.contains(STORE_NAMES.BOARDS)) {
    const store = db.createObjectStore(STORE_NAMES.BOARDS, { keyPath: 'id' })
    store.createIndex('isStarred', 'isStarred', { unique: false })
    store.createIndex('isArchived', 'isArchived', { unique: false })
    store.createIndex('position', 'position', { unique: false })
  }

  // Lists
  if (!db.objectStoreNames.contains(STORE_NAMES.LISTS)) {
    const store = db.createObjectStore(STORE_NAMES.LISTS, { keyPath: 'id' })
    store.createIndex('boardId', 'boardId', { unique: false })
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
