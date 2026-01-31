/**
 * Card database operations.
 * Single responsibility: Card CRUD operations.
 */

import {
  STORE_NAMES,
  POSITION_GAP,
  addItem,
  getItem,
  getItemOrThrow,
  getItemsByIndex,
  updateItem,
  generateId,
  now,
} from '../core'
import type { Card, CreateCardInput } from '../types'

export async function createCard(data: CreateCardInput): Promise<Card> {
  const existing = await getCardsByList(data.listId)
  const maxPosition =
    existing.length > 0 ? Math.max(...existing.map((c) => c.position)) : 0

  const card: Card = {
    ...data,
    id: generateId(),
    position: maxPosition + POSITION_GAP,
    createdAt: now(),
    updatedAt: now(),
  }

  await addItem(STORE_NAMES.CARDS, card)
  return card
}

export async function quickCreateCard(
  listId: string,
  boardId: string,
  title: string,
): Promise<Card> {
  return createCard({
    listId,
    boardId,
    title,
    description: '',
    position: 0,
    coverType: 'none',
    coverValue: '',
    dueDate: null,
    dueDateCompleted: false,
    isArchived: false,
  })
}

export async function getCard(id: string): Promise<Card | undefined> {
  return getItem<Card>(STORE_NAMES.CARDS, id)
}

export async function getCardOrThrow(id: string): Promise<Card> {
  return getItemOrThrow<Card>(STORE_NAMES.CARDS, id, 'Card')
}

export async function getCardsByList(listId: string): Promise<Card[]> {
  const cards = await getItemsByIndex<Card>(STORE_NAMES.CARDS, 'listId', listId)
  return cards.sort((a, b) => a.position - b.position)
}

export async function getActiveCardsByList(listId: string): Promise<Card[]> {
  const cards = await getCardsByList(listId)
  return cards.filter((c) => !c.isArchived)
}

export async function getCardsByBoard(boardId: string): Promise<Card[]> {
  const cards = await getItemsByIndex<Card>(
    STORE_NAMES.CARDS,
    'boardId',
    boardId,
  )
  return cards.sort((a, b) => a.position - b.position)
}

export async function updateCard(
  id: string,
  updates: Partial<Card>,
): Promise<Card> {
  return updateItem<Card>(STORE_NAMES.CARDS, id, {
    ...updates,
    updatedAt: now(),
  })
}

export async function archiveCard(id: string): Promise<Card> {
  return updateCard(id, { isArchived: true })
}

export async function restoreCard(id: string): Promise<Card> {
  return updateCard(id, { isArchived: false })
}

export async function setCardDueDate(
  id: string,
  dueDate: number | null,
): Promise<Card> {
  return updateCard(id, { dueDate, dueDateCompleted: false })
}

export async function toggleDueDateComplete(id: string): Promise<Card> {
  const card = await getCardOrThrow(id)
  return updateCard(id, { dueDateCompleted: !card.dueDateCompleted })
}
