/**
 * Low-level promisified helpers for IndexedDB requests.
 * Single responsibility: Wrap IDBRequest/IDBTransaction in Promises.
 */

import { getDB } from './database'
import { DatabaseError } from './errors'

/** Wrap an IDBRequest in a Promise */
export function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(new DatabaseError('Request failed', request.error))
  })
}

/** Wait for a transaction to complete */
export function promisifyTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(new DatabaseError('Transaction failed', tx.error))
    tx.onabort = () =>
      reject(new DatabaseError('Transaction aborted', tx.error))
  })
}

/** Get a transaction for the specified stores */
export async function getTransaction(
  storeNames: string | Array<string>,
  mode: IDBTransactionMode = 'readonly',
): Promise<IDBTransaction> {
  const db = await getDB()
  return db.transaction(storeNames, mode)
}

/** Get an object store with the specified mode */
export async function getStore(
  storeName: string,
  mode: IDBTransactionMode = 'readonly',
): Promise<IDBObjectStore> {
  const tx = await getTransaction(storeName, mode)
  return tx.objectStore(storeName)
}

/** Generate a new unique ID */
export function generateId(): string {
  return crypto.randomUUID()
}

/** Get current timestamp */
export function now(): number {
  return Date.now()
}
