/**
 * Core module barrel export.
 */

export {
  DB_NAME,
  DB_VERSION,
  STORE_NAMES,
  MAX_FILE_SIZE,
  IMAGE_COMPRESSION_THRESHOLD,
  POSITION_GAP,
  LABEL_COLORS,
  BOARD_BACKGROUNDS,
  type StoreName,
  type LabelColor,
} from './constants'

export {
  DatabaseError,
  NotFoundError,
  TransactionError,
  StorageQuotaError,
  FileSizeError,
  ConstraintError,
} from './errors'

export { initDB, getDB, closeDB, deleteDatabase } from './database'

export {
  promisifyRequest,
  promisifyTransaction,
  getTransaction,
  getStore,
  generateId,
  now,
} from './helpers'

export {
  addItem,
  getItem,
  getItemOrThrow,
  getAllItems,
  getItemsByIndex,
  getItemsWithFilter,
  updateItem,
  putItem,
  deleteItem,
  deleteItems,
  deleteItemsByIndex,
  countItems,
  clearStore,
} from './crud'

export {
  runTransaction,
  txGet,
  txGetAll,
  txDeleteByIndex,
} from './transactions'

export {
  calculateInsertPosition,
  needsNormalization,
  normalizePositions,
} from './position'
