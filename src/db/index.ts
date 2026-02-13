/**
 * Database module barrel export.
 * Provides a unified API for all database functionality.
 */

// Core exports
export {
  // Constants
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
  // Errors
  DatabaseError,
  NotFoundError,
  TransactionError,
  StorageQuotaError,
  FileSizeError,
  ConstraintError,
  // Database lifecycle
  initDB,
  getDB,
  closeDB,
  deleteDatabase,
  // Helpers
  generateId,
  now,
  // CRUD utilities
  getItemsWithFilter,
  // Transaction support
  runTransaction,
  // Position utilities
  calculateInsertPosition,
  normalizePositions,
} from './core'

// Type exports
export type {
  Board,
  List,
  Card,
  Label,
  CardLabel,
  Checklist,
  ChecklistItem,
  Attachment,
  Setting,
  Workspace,
  CreateWorkspaceInput,
  CreateBoardInput,
  CreateListInput,
  CreateCardInput,
  CreateLabelInput,
  CreateChecklistInput,
  CreateChecklistItemInput,
  UpdateInput,
  PositionUpdate,
  CardWithDetails,
  ChecklistWithItems,
  BoardWithData,
  ListWithCards,
  CardFilters,
  StorageBreakdown,
  BoardStorageInfo,
} from './types'

// Operations exports
export {
  // Workspaces
  createWorkspace,
  getWorkspace,
  getWorkspaceBySlug,
  getWorkspaceBySlugOrThrow,
  getWorkspaceOrThrow,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  // Boards
  createBoard,
  getBoard,
  getBoardOrThrow,
  getAllBoards,
  getActiveBoards,
  getArchivedBoards,
  getStarredBoards,
  getBoardsByWorkspace,
  updateBoard,
  archiveBoard,
  restoreBoard,
  toggleBoardStar,
  // Lists
  createList,
  getList,
  getListOrThrow,
  getListsByBoard,
  getActiveListsByBoard,
  updateList,
  archiveList,
  restoreList,
  toggleListCollapse,
  // Cards
  createCard,
  quickCreateCard,
  getCard,
  getCardOrThrow,
  getCardsByList,
  getActiveCardsByList,
  getCardsByBoard,
  updateCard,
  archiveCard,
  restoreCard,
  setCardDueDate,
  toggleDueDateComplete,
  // Labels
  createLabel,
  getLabel,
  getLabelsByBoard,
  updateLabel,
  deleteLabel,
  addLabelToCard,
  removeLabelFromCard,
  toggleLabelOnCard,
  getLabelsForCard,
  getCardsWithLabel,
  // Checklists
  createChecklist,
  getChecklist,
  getChecklistsByCard,
  updateChecklist,
  deleteChecklist,
  createChecklistItem,
  getChecklistItem,
  getItemsByChecklist,
  updateChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  // Attachments
  createAttachment,
  getAttachment,
  getAttachmentsByCard,
  deleteAttachment,
  // Settings
  getSetting,
  setSetting,
  deleteSetting,
  // Cascade deletes
  cascadeDeleteBoard,
  cascadeDeleteList,
  cascadeDeleteCard,
  // Batch operations
  batchUpdatePositions,
  moveCardTransaction,
  moveListTransaction,
} from './operations'

// Storage utilities
export {
  getStorageEstimate,
  calculateStorageUsage,
  getStorageByBoard,
  formatBytes,
  getStorageWarningLevel,
  getStorageLimitConfig,
  updateCustomStorageLimit,
  toggleUseCustomLimit,
  // Search utilities
  searchCards,
  getOverdueCards,
  getCardsDueSoon,
} from './utils'
