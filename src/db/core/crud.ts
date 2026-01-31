/**
 * Generic CRUD operations for any object store.
 * Single responsibility: Basic database CRUD operations.
 */

import {
  getStore,
  getTransaction,
  promisifyRequest,
  promisifyTransaction,
} from './helpers'
import { DatabaseError, NotFoundError } from './errors'

/** Add a single item to a store */
export async function addItem<T>(storeName: string, item: T): Promise<string> {
  const store = await getStore(storeName, 'readwrite')
  const request = store.add(item)
  return promisifyRequest(request) as Promise<string>
}

/** Get a single item by primary key */
export async function getItem<T>(
  storeName: string,
  id: string,
): Promise<T | undefined> {
  const store = await getStore(storeName, 'readonly')
  const request = store.get(id)
  return promisifyRequest(request)
}

/** Get item or throw if not found */
export async function getItemOrThrow<T>(
  storeName: string,
  id: string,
  entityName: string = storeName,
): Promise<T> {
  const item = await getItem<T>(storeName, id)
  if (!item) throw new NotFoundError(entityName, id)
  return item
}

/** Get all items from a store */
export async function getAllItems<T>(storeName: string): Promise<Array<T>> {
  const store = await getStore(storeName, 'readonly')
  const request = store.getAll()
  return promisifyRequest(request)
}

/** Get items by an index value */
export async function getItemsByIndex<T>(
  storeName: string,
  indexName: string,
  value: IDBValidKey,
): Promise<Array<T>> {
  const store = await getStore(storeName, 'readonly')
  const index = store.index(indexName)
  const request = index.getAll(value)
  return promisifyRequest(request)
}

/** Get items with a filter function */
export async function getItemsWithFilter<T>(
  storeName: string,
  filterFn: (item: T) => boolean,
): Promise<Array<T>> {
  const store = await getStore(storeName, 'readonly')
  const request = store.openCursor()
  const results: Array<T> = []

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        if (filterFn(cursor.value as T)) results.push(cursor.value as T)
        cursor.continue()
      } else {
        resolve(results)
      }
    }
    request.onerror = () =>
      reject(new DatabaseError('Failed to read items', request.error))
  })
}

/** Update an item by merging with existing data */
export async function updateItem<T extends { id: string }>(
  storeName: string,
  id: string,
  updates: Partial<T>,
): Promise<T> {
  const store = await getStore(storeName, 'readwrite')
  const existing = await promisifyRequest<T | undefined>(store.get(id))
  if (!existing) throw new NotFoundError(storeName, id)

  const updated = { ...existing, ...updates } as T
  await promisifyRequest(store.put(updated))
  return updated
}

/** Replace an item entirely */
export async function putItem<T>(storeName: string, item: T): Promise<void> {
  const store = await getStore(storeName, 'readwrite')
  await promisifyRequest(store.put(item))
}

/** Delete a single item by ID */
export async function deleteItem(storeName: string, id: string): Promise<void> {
  const store = await getStore(storeName, 'readwrite')
  await promisifyRequest(store.delete(id))
}

/** Delete multiple items by their IDs */
export async function deleteItems(
  storeName: string,
  ids: Array<string>,
): Promise<void> {
  const tx = await getTransaction(storeName, 'readwrite')
  const store = tx.objectStore(storeName)
  ids.forEach((id) => store.delete(id))
  return promisifyTransaction(tx)
}

/** Delete all items matching an index value */
export async function deleteItemsByIndex(
  storeName: string,
  indexName: string,
  value: IDBValidKey,
): Promise<Array<string>> {
  const items = await getItemsByIndex<{ id: string }>(
    storeName,
    indexName,
    value,
  )
  const ids = items.map((item) => item.id)
  if (ids.length > 0) await deleteItems(storeName, ids)
  return ids
}

/** Count all items in a store */
export async function countItems(storeName: string): Promise<number> {
  const store = await getStore(storeName, 'readonly')
  return promisifyRequest(store.count())
}

/** Clear all items from a store */
export async function clearStore(storeName: string): Promise<void> {
  const store = await getStore(storeName, 'readwrite')
  await promisifyRequest(store.clear())
}
