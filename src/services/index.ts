/**
 * Services layer barrel export.
 * Provides business logic APIs for UI components.
 */

// Board service
export {
  createBoard,
  getBoardWithData,
  getBoards,
  getStarredBoards,
  getArchivedBoards,
  updateBoard,
  toggleStar,
  archiveBoard,
  restoreBoard,
  deleteBoard,
  duplicateBoard,
} from './board.service'

// List service
export {
  createList,
  getList,
  getListOrThrow,
  getListsByBoard,
  getActiveListsByBoard,
  getListWithCards,
  updateList,
  renameList,
  toggleListCollapse,
  archiveList,
  restoreList,
  deleteList,
  moveAllCards,
  copyList,
  reorderLists,
  moveList,
} from './list.service'

// Card service
export {
  createCard,
  getCard,
  getCardOrThrow,
  getCardsByList,
  getActiveCardsByList,
  getCardsByBoard,
  getCardWithDetails,
  updateCard,
  updateCardTitle,
  updateCardDescription,
  setCardCover,
  removeCardCover,
  setCardDueDate,
  toggleDueDateComplete,
  archiveCard,
  restoreCard,
  deleteCard,
  moveCard,
  reorderCards,
  copyCard,
  getDueDateStatus,
} from './card.service'

// Label service
export {
  createLabel,
  getLabel,
  getLabelsByBoard,
  getLabelsForCard,
  getCardsWithLabel,
  updateLabel,
  deleteLabel,
  addLabelToCard,
  removeLabelFromCard,
  toggleLabelOnCard,
  getAvailableColors,
  getSuggestedColor,
} from './label.service'

// Checklist service
export {
  createChecklist,
  getChecklist,
  getChecklistsByCard,
  getChecklistWithItems,
  getChecklistsWithItems,
  renameChecklist,
  deleteChecklist,
  copyChecklist,
  addChecklistItem,
  getChecklistItem,
  getItemsByChecklist,
  updateItemText,
  toggleChecklistItem,
  completeItem,
  uncompleteItem,
  deleteChecklistItem,
  calculateChecklistProgress,
  calculateCardChecklistProgress,
} from './checklist.service'

// Attachment service
export {
  uploadAttachment,
  getAttachment,
  getAttachmentsByCard,
  deleteAttachment,
  downloadAttachment,
  getAttachmentUrl,
  setAsCover,
  fileToBase64,
  base64ToBlob,
  generateThumbnail,
  compressImage,
  formatFileSize,
  getFileTypeIcon,
} from './attachment.service'

// Export service
export {
  exportBoard,
  downloadBoardAsJson,
  exportAllBoards,
  importBoard,
  importFromFile,
} from './export.service'

// Storage service
export {
  getStorageOverview,
  getBoardStorageBreakdown,
  analyzeStorage,
  deleteArchivedBoards,
  deleteArchivedCards,
  compressAllImages,
  formatBytes,
  getStorageWarningLevel,
  cascadeDeleteBoard,
  cascadeDeleteCard,
  getStorageLimitConfig,
  updateCustomStorageLimit,
  toggleUseCustomLimit,
} from './storage.service'

// Search service
export {
  searchCards,
  searchBoards,
  globalSearch,
  getOverdueCards,
  getCardsDueSoon,
  getCardsWithLabels,
  getCardsWithAttachments,
  getRecentlyModifiedCards,
  highlightMatch,
  type SearchResult,
  type SearchFilters,
} from './search.service'
