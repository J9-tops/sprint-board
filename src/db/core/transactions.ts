/**
 * Transaction support for atomic multi-store operations.
 * Single responsibility: Transaction management.
 */

import { getDB } from './database'
import { promisifyTransaction } from './helpers'
import { TransactionError } from './errors'

/**
 * Execute operations in a single atomic transaction.
 * All changes roll back if any operation fails.
 */
export async function runTransaction<T>(
  storeNames: string[],
  mode: IDBTransactionMode,
  operations: (
    stores: Record<string, IDBObjectStore>,
    tx: IDBTransaction,
  ) => Promise<T>,
): Promise<T> {
  const db = await getDB()
  const tx = db.transaction(storeNames, mode)
  const stores: Record<string, IDBObjectStore> = {}

  storeNames.forEach((name) => {
    stores[name] = tx.objectStore(name)
  })

  try {
    const result = await operations(stores, tx)
    await promisifyTransaction(tx)
    return result
  } catch (error) {
    tx.abort()
    throw new TransactionError('Transaction failed', error)
  }
}

/** Promisify a get request within a transaction */
export function txGet<T>(store: IDBObjectStore, id: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = store.get(id)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/** Promisify a getAll request within a transaction */
export function txGetAll<T>(index: IDBIndex, value: IDBValidKey): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const request = index.getAll(value)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/** Delete all items by index using cursor within transaction */
export function txDeleteByIndex(
  store: IDBObjectStore,
  indexName: string,
  value: IDBValidKey,
): void {
  const index = store.index(indexName)
  index.openCursor(IDBKeyRange.only(value)).onsuccess = (event) => {
    const cursor = (event.target as IDBRequest).result
    if (cursor) {
      cursor.delete()
      cursor.continue()
    }
  }
}
