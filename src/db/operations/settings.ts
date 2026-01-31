/**
 * Settings database operations.
 * Single responsibility: Key-value settings CRUD.
 */

import { STORE_NAMES, deleteItem, getItem, now, putItem } from '../core'
import type { Setting } from '../types'

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const setting = await getItem<Setting>(STORE_NAMES.SETTINGS, key)
  return setting?.value as T | undefined
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const setting: Setting = {
    key,
    value,
    updatedAt: now(),
  }
  await putItem(STORE_NAMES.SETTINGS, setting)
}

export async function deleteSetting(key: string): Promise<void> {
  await deleteItem(STORE_NAMES.SETTINGS, key)
}
