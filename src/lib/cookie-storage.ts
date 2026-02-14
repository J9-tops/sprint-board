/**
 * Sets a browser cookie with a specified name, value, and expiration. It safely does nothing when executed in a non-browser environment.
 *
 * This function is useful for persisting small pieces of data across user sessions using cookies.
 *
 * Args:
 *   name: The name of the cookie to set.
 *   value: The string value to store in the cookie.
 *   days: The number of days until the cookie expires; defaults to 365.
 *
 * Returns:
 *   Nothing.
 */
export function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + date.toUTCString()
  document.cookie = name + '=' + value + ';' + expires + ';path=/'
}

/**
 * Retrieves the value of a browser cookie by its name. It safely returns null when the cookie is not found or when executed in a non-browser environment.
 *
 * This function is useful for reading previously stored cookie data needed for user preferences or session handling.
 *
 * Args:
 *   name: The name of the cookie to retrieve.
 *
 * Returns:
 *   The cookie value as a string if found, or null if the cookie does not exist or cannot be accessed.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let c of ca) {
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

/**
 * Stores a value in the browser's localStorage under a given key. It safely does nothing in non-browser environments and logs an error if storage fails.
 *
 * This function is useful for persisting structured data across sessions by serializing it to JSON.
 *
 * Args:
 *   key: The localStorage key under which the value will be stored.
 *   value: The data to store, which will be JSON-stringified before saving.
 *
 * Returns:
 *   Nothing.
 */
export function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`Failed to set localStorage item "${key}":`, e)
  }
}

/**
 * Retrieves a value from the browser's localStorage by key, falling back to a provided default when unavailable. It safely handles non-browser environments and JSON parsing errors.
 *
 * This function is useful for restoring previously persisted state while guaranteeing a consistent return value.
 *
 * Args:
 *   key: The localStorage key whose value should be retrieved.
 *   defaultValue: The value to return if the key is not found or cannot be read.
 *
 * Returns:
 *   The parsed value from localStorage if available and valid, otherwise the provided defaultValue.
 */
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    console.error(`Failed to get localStorage item "${key}":`, e)
    return defaultValue
  }
}

/**
 * Removes a value from the browser's localStorage for a given key. It safely does nothing in non-browser environments and logs an error if removal fails.
 *
 * This function is useful for clearing stored state or user data when it is no longer needed.
 *
 * Args:
 *   key: The localStorage key whose associated value should be removed.
 *
 * Returns:
 *   Nothing.
 */
export function removeLocalStorageItem(key: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.error(`Failed to remove localStorage item "${key}":`, e)
  }
}
