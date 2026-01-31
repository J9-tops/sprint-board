import type { BoardWithData } from '../db/types/aggregates'
import type { Card } from '../db/types/entities'

export interface BoardData {
  lists: Array<ListData>
  version: string
}

export interface ListData {
  id: string
  title: string
  cards: Array<CardData>
}

export interface CardData {
  id: string
  title: string
  labels?: Array<{ name: string; color: string; type?: 'pill' | 'dot' }>
  dueDate?: {
    text: string
    status: 'overdue' | 'today' | 'normal' | 'completed'
  }
  checklist?: { total: number; completed: number }
  attachmentCount?: number
  hasDescription?: boolean
  coverImage?: string
  topBorderColor?: string
}

export interface BoardStore {
  boardData: BoardData
  isLoading: boolean
  currentBoardId: string | null
  loadBoard: (boardId: string) => Promise<void>
  reorderCards: (
    sourceListId: string,
    sourceCardId: string,
    targetListId: string,
    targetCardId: string,
  ) => Promise<void>
  reorderLists: (sourceListId: string, targetListId: string) => Promise<void>
}

function formatCard(
  card: Card,
  labels: Array<{ name: string; color: string }>,
): CardData {
  return {
    id: card.id,
    title: card.title,
    hasDescription: card.description.length > 0,
    labels: labels.length > 0 ? labels : undefined,
    dueDate: card.dueDate
      ? {
          text: new Date(card.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          status: card.dueDateCompleted
            ? 'completed'
            : card.dueDate < Date.now()
              ? 'overdue'
              : 'normal',
        }
      : undefined,
  }
}

export function toBoardData(board: BoardWithData): BoardData {
  return {
    version: '1.0.0',
    lists: board.lists.map((list) => ({
      id: list.id,
      title: list.name,
      cards: list.cards.map((card) => formatCard(card, [])),
    })),
  }
}
