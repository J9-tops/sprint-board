/**
 * Board database operations.
 * Single responsibility: Board CRUD operations.
 */

import {
  POSITION_GAP,
  STORE_NAMES,
  addItem,
  generateId,
  getAllItems,
  getItem,
  getItemOrThrow,
  getItemsWithFilter,
  now,
  updateItem,
} from '../core'
import type { Board, CreateBoardInput } from '../types'

export async function createBoard(data: CreateBoardInput): Promise<Board> {
  const existing = await getAllBoards()
  const maxPosition =
    existing.length > 0 ? Math.max(...existing.map((b) => b.position)) : 0

  const board: Board = {
    ...data,
    id: generateId(),
    position: maxPosition + POSITION_GAP,
    createdAt: now(),
    updatedAt: now(),
  }

  await addItem(STORE_NAMES.BOARDS, board)
  return board
}

export async function getBoard(id: string): Promise<Board | undefined> {
  return getItem<Board>(STORE_NAMES.BOARDS, id)
}

export async function getBoardOrThrow(id: string): Promise<Board> {
  return getItemOrThrow<Board>(STORE_NAMES.BOARDS, id, 'Board')
}

export async function getAllBoards(): Promise<Array<Board>> {
  const boards = await getAllItems<Board>(STORE_NAMES.BOARDS)
  return boards.sort((a, b) => a.position - b.position)
}

export async function getActiveBoards(): Promise<Array<Board>> {
  const boards = await getItemsWithFilter<Board>(
    STORE_NAMES.BOARDS,
    (b) => !b.isArchived,
  )
  return boards.sort((a, b) => a.position - b.position)
}

export async function getArchivedBoards(): Promise<Array<Board>> {
  const boards = await getItemsWithFilter<Board>(
    STORE_NAMES.BOARDS,
    (b) => b.isArchived,
  )
  return boards.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function getStarredBoards(): Promise<Array<Board>> {
  const boards = await getItemsWithFilter<Board>(
    STORE_NAMES.BOARDS,
    (b) => b.isStarred && !b.isArchived,
  )
  return boards.sort((a, b) => a.position - b.position)
}

export async function getBoardsByWorkspace(
  workspaceId: string | null,
): Promise<Array<Board>> {
  const boards = await getItemsWithFilter<Board>(
    STORE_NAMES.BOARDS,
    (b) => !b.isArchived && b.workspaceId === workspaceId,
  )
  return boards.sort((a, b) => a.position - b.position)
}

export async function updateBoard(
  id: string,
  updates: Partial<Board>,
): Promise<Board> {
  return updateItem<Board>(STORE_NAMES.BOARDS, id, {
    ...updates,
    updatedAt: now(),
  })
}

export async function archiveBoard(id: string): Promise<Board> {
  return updateBoard(id, { isArchived: true })
}

export async function restoreBoard(id: string): Promise<Board> {
  return updateBoard(id, { isArchived: false })
}

export async function toggleBoardStar(id: string): Promise<Board> {
  const board = await getBoardOrThrow(id)
  return updateBoard(id, { isStarred: !board.isStarred })
}
