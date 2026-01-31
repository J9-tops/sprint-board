/**
 * Custom error classes for database operations.
 */

/** Base class for all database errors */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

/** Thrown when an entity is not found */
export class NotFoundError extends DatabaseError {
  constructor(
    public readonly entity: string,
    public readonly id: string,
  ) {
    super(`${entity} with id "${id}" not found`)
    this.name = 'NotFoundError'
  }
}

/** Thrown when a transaction fails */
export class TransactionError extends DatabaseError {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'TransactionError'
  }
}

/** Thrown when storage quota is exceeded */
export class StorageQuotaError extends DatabaseError {
  constructor(
    public readonly requiredBytes: number,
    public readonly availableBytes: number,
  ) {
    super(
      `Storage quota exceeded. Required: ${formatBytes(requiredBytes)}, ` +
        `Available: ${formatBytes(availableBytes)}`,
    )
    this.name = 'StorageQuotaError'
  }
}

/** Thrown when file size exceeds limit */
export class FileSizeError extends DatabaseError {
  constructor(
    public readonly fileSize: number,
    public readonly maxSize: number,
  ) {
    super(
      `File size ${formatBytes(fileSize)} exceeds maximum of ${formatBytes(maxSize)}`,
    )
    this.name = 'FileSizeError'
  }
}

/** Thrown when a constraint is violated */
export class ConstraintError extends DatabaseError {
  constructor(message: string) {
    super(message)
    this.name = 'ConstraintError'
  }
}

/** Format bytes for error messages */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
