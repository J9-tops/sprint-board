import { create } from 'zustand'
import type { BoardData, BoardStore } from '@/types/board'
import { getBoardWithData } from '@/services/board.service'
import { moveCardTransaction, moveListTransaction } from '@/db'
import { createCard, deleteCard, updateCard } from '@/services/card.service'
import {
  createList,
  deleteList as deleteListService,
  updateList as updateListService,
} from '@/services/list.service'

const DEFAULT_BOARD_DATA: BoardData = {
  version: '1.0.0',
  lists: [],
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  boardData: DEFAULT_BOARD_DATA,
  isLoading: false,
  currentBoardId: null,

  loadBoard: async (boardId: string) => {
    set({ isLoading: true })
    try {
      const board = await getBoardWithData(boardId)
      const boardData = await import('@/types/board').then((m) =>
        m.toBoardData(board),
      )
      set({ boardData, currentBoardId: boardId, isLoading: false })
    } catch (e) {
      console.error('Failed to load board:', e)
      set({ isLoading: false })
    }
  },

  reorderCards: async (
    sourceListId,
    sourceCardId,
    targetListId,
    targetCardId,
  ) => {
    const { boardData } = get()

    const sourceList = boardData.lists.find((l) => l.id === sourceListId)
    const targetList = boardData.lists.find((l) => l.id === targetListId)

    if (!sourceList || !targetList) return

    const cardIndex = sourceList.cards.findIndex((c) => c.id === sourceCardId)
    if (cardIndex === -1) return

    const targetIndex = targetList.cards.findIndex((c) => c.id === targetCardId)

    try {
      await moveCardTransaction(
        sourceCardId,
        sourceListId,
        targetListId,
        targetIndex,
      )

      const movedCard = sourceList.cards.splice(cardIndex, 1)[0]
      targetList.cards.splice(targetIndex, 0, movedCard)

      set({
        boardData: {
          ...boardData,
          lists: boardData.lists.map((l) =>
            l.id === sourceListId
              ? { ...l, cards: [...l.cards] }
              : l.id === targetListId
                ? { ...l, cards: [...l.cards] }
                : l,
          ),
        },
      })
    } catch (e) {
      console.error('Failed to reorder cards:', e)
    }
  },

  reorderLists: async (sourceListId, targetListId) => {
    const { boardData, currentBoardId } = get()
    if (!currentBoardId) return

    const lists = [...boardData.lists]
    const sourceIndex = lists.findIndex((l) => l.id === sourceListId)
    const targetIndex = lists.findIndex((l) => l.id === targetListId)

    if (sourceIndex === -1 || targetIndex === -1) return

    try {
      await moveListTransaction(sourceListId, currentBoardId, targetIndex)

      const [movedList] = lists.splice(sourceIndex, 1)
      lists.splice(targetIndex, 0, movedList)

      set({
        boardData: {
          ...boardData,
          lists,
        },
      })
    } catch (e) {
      console.error('Failed to reorder lists:', e)
    }
  },

  addCard: async (listId, title) => {
    const { boardData, currentBoardId } = get()
    if (!currentBoardId) return

    const list = boardData.lists.find((l) => l.id === listId)
    if (!list) return

    try {
      const newCard = await createCard(listId, currentBoardId, title)

      set({
        boardData: {
          ...boardData,
          lists: boardData.lists.map((l) =>
            l.id === listId
              ? { ...l, cards: [...l.cards, { id: newCard.id, title }] }
              : l,
          ),
        },
      })
    } catch (e) {
      console.error('Failed to add card:', e)
    }
  },

  addList: async (name) => {
    const { boardData, currentBoardId } = get()
    if (!currentBoardId) return

    try {
      const newList = await createList(currentBoardId, name)

      set({
        boardData: {
          ...boardData,
          lists: [
            ...boardData.lists,
            { id: newList.id, title: newList.name, cards: [] },
          ],
        },
      })
    } catch (e) {
      console.error('Failed to add list:', e)
    }
  },

  updateList: async (listId, name) => {
    const { boardData } = get()

    try {
      await updateListService(listId, { name })

      set({
        boardData: {
          ...boardData,
          lists: boardData.lists.map((l) =>
            l.id === listId ? { ...l, title: name } : l,
          ),
        },
      })
    } catch (e) {
      console.error('Failed to update list:', e)
    }
  },

  deleteList: async (listId) => {
    const { boardData } = get()

    try {
      await deleteListService(listId)

      set({
        boardData: {
          ...boardData,
          lists: boardData.lists.filter((l) => l.id !== listId),
        },
      })
    } catch (e) {
      console.error('Failed to delete list:', e)
    }
  },

  updateCard: async (cardId, title) => {
    const { boardData } = get()

    try {
      await updateCard(cardId, { title })

      set({
        boardData: {
          ...boardData,
          lists: boardData.lists.map((list) => ({
            ...list,
            cards: list.cards.map((card) =>
              card.id === cardId ? { ...card, title } : card,
            ),
          })),
        },
      })
    } catch (e) {
      console.error('Failed to update card:', e)
    }
  },

  deleteCard: async (cardId, listId) => {
    const { boardData } = get()

    try {
      await deleteCard(cardId)

      set({
        boardData: {
          ...boardData,
          lists: boardData.lists.map((list) =>
            list.id === listId
              ? { ...list, cards: list.cards.filter((c) => c.id !== cardId) }
              : list,
          ),
        },
      })
    } catch (e) {
      console.error('Failed to delete card:', e)
    }
  },
}))
