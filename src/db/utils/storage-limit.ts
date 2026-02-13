/**
 * Storage limit configuration utilities.
 * Manages custom storage limit settings with localStorage persistence.
 */

import type { StorageLimitConfig } from '../types'

const DEFAULT_STORAGE_LIMIT = 5 * 1024 * 1024 * 1024
const STORAGE_LIMIT_KEY = 'storage-limit-config'

/**
 * Get the current storage limit configuration.
 * Falls back to default 5GB if not set.
 */
export function getStorageLimitConfig(): StorageLimitConfig {
  const saved = localStorage.getItem(STORAGE_LIMIT_KEY)
  if (!saved) {
    return {
      customLimit: DEFAULT_STORAGE_LIMIT,
      useCustomLimit: false,
    }
  }

  try {
    const config = JSON.parse(saved) as Partial<StorageLimitConfig>
    return {
      customLimit: config.customLimit || DEFAULT_STORAGE_LIMIT,
      useCustomLimit: Boolean(config.useCustomLimit),
    }
  } catch {
    return {
      customLimit: DEFAULT_STORAGE_LIMIT,
      useCustomLimit: false,
    }
  }
}

/**
 * Set the storage limit configuration.
 */
export function setStorageLimitConfig(config: StorageLimitConfig): void {
  try {
    localStorage.setItem(STORAGE_LIMIT_KEY, JSON.stringify(config))
  } catch (e) {
    console.error('Failed to save storage limit config:', e)
  }
}

/**
 * Get the effective storage limit.
 * Returns custom limit if enabled, otherwise browser quota.
 */
export function getEffectiveStorageLimit(browserQuota?: number): number {
  const config = getStorageLimitConfig()

  if (!config.useCustomLimit) {
    return browserQuota || Infinity
  }

  return config.customLimit
}

/**
 * Update custom storage limit.
 */
export function updateCustomStorageLimit(bytes: number): void {
  const config = getStorageLimitConfig()
  setStorageLimitConfig({
    ...config,
    customLimit: bytes,
  })
}

/**
 * Toggle whether to use custom limit.
 */
export function toggleUseCustomLimit(useCustom: boolean): void {
  const config = getStorageLimitConfig()
  setStorageLimitConfig({
    ...config,
    useCustomLimit: useCustom,
  })
}
