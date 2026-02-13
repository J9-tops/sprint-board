/**
 * Database configuration constants.
 */

export const DB_NAME = 'sprint-board-db'
export const DB_VERSION = 3

/** Object store names for type-safe access */
export const STORE_NAMES = {
  WORKSPACES: 'workspaces',
  BOARDS: 'boards',
  LISTS: 'lists',
  CARDS: 'cards',
  LABELS: 'labels',
  CARD_LABELS: 'cardLabels',
  CHECKLISTS: 'checklists',
  CHECKLIST_ITEMS: 'checklistItems',
  ATTACHMENTS: 'attachments',
  SETTINGS: 'settings',
} as const

export type StoreName = (typeof STORE_NAMES)[keyof typeof STORE_NAMES]

/** File size limits */
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB per file
export const IMAGE_COMPRESSION_THRESHOLD = 1 * 1024 * 1024 // 1MB

/**
 * Gap between position values for efficient insertions.
 * Allows inserting between items without reindexing.
 */
export const POSITION_GAP = 65536

/** Label color options */
export const LABEL_COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'pink',
  'gray',
  'brown',
] as const

export type LabelColor = (typeof LABEL_COLORS)[number]

/** Board background presets */
export const BOARD_BACKGROUNDS = {
  SOLID: [
    '#0079BF',
    '#D29034',
    '#519839',
    '#B04632',
    '#89609E',
    '#CD5A91',
    '#4BBF6B',
    '#00AECC',
    '#838C91',
    '#344563',
  ],
  GRADIENTS: [
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
  ],
} as const
