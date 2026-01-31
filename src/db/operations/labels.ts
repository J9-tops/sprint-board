/**
 * Label database operations.
 * Single responsibility: Label CRUD and card-label relationships.
 */

import {
  STORE_NAMES,
  addItem,
  deleteItem,
  deleteItemsByIndex,
  generateId,
  getItem,
  getItemsByIndex,
  now,
  updateItem,
} from '../core'
import type { CardLabel, CreateLabelInput, Label } from '../types'

export async function createLabel(data: CreateLabelInput): Promise<Label> {
  const label: Label = {
    ...data,
    id: generateId(),
    createdAt: now(),
  }
  await addItem(STORE_NAMES.LABELS, label)
  return label
}

export async function getLabel(id: string): Promise<Label | undefined> {
  return getItem<Label>(STORE_NAMES.LABELS, id)
}

export async function getLabelsByBoard(boardId: string): Promise<Array<Label>> {
  return getItemsByIndex<Label>(STORE_NAMES.LABELS, 'boardId', boardId)
}

export async function updateLabel(
  id: string,
  updates: Partial<Label>,
): Promise<Label> {
  return updateItem<Label>(STORE_NAMES.LABELS, id, updates)
}

export async function deleteLabel(id: string): Promise<void> {
  await deleteItemsByIndex(STORE_NAMES.CARD_LABELS, 'labelId', id)
  await deleteItem(STORE_NAMES.LABELS, id)
}

// Card-Label relationships

export async function addLabelToCard(
  cardId: string,
  labelId: string,
): Promise<CardLabel> {
  const existing = await getCardLabelEntry(cardId, labelId)
  if (existing) return existing

  const cardLabel: CardLabel = {
    id: generateId(),
    cardId,
    labelId,
    addedAt: now(),
  }
  await addItem(STORE_NAMES.CARD_LABELS, cardLabel)
  return cardLabel
}

export async function removeLabelFromCard(
  cardId: string,
  labelId: string,
): Promise<void> {
  const entry = await getCardLabelEntry(cardId, labelId)
  if (entry) {
    await deleteItem(STORE_NAMES.CARD_LABELS, entry.id)
  }
}

export async function toggleLabelOnCard(
  cardId: string,
  labelId: string,
): Promise<boolean> {
  const entry = await getCardLabelEntry(cardId, labelId)
  if (entry) {
    await deleteItem(STORE_NAMES.CARD_LABELS, entry.id)
    return false
  } else {
    await addLabelToCard(cardId, labelId)
    return true
  }
}

async function getCardLabelEntry(
  cardId: string,
  labelId: string,
): Promise<CardLabel | undefined> {
  const entries = await getItemsByIndex<CardLabel>(
    STORE_NAMES.CARD_LABELS,
    'cardId',
    cardId,
  )
  return entries.find((e) => e.labelId === labelId)
}

export async function getLabelsForCard(cardId: string): Promise<Array<Label>> {
  const entries = await getItemsByIndex<CardLabel>(
    STORE_NAMES.CARD_LABELS,
    'cardId',
    cardId,
  )

  const labels: Array<Label> = []
  for (const entry of entries) {
    const label = await getLabel(entry.labelId)
    if (label) labels.push(label)
  }
  return labels
}

export async function getCardsWithLabel(
  labelId: string,
): Promise<Array<string>> {
  const entries = await getItemsByIndex<CardLabel>(
    STORE_NAMES.CARD_LABELS,
    'labelId',
    labelId,
  )
  return entries.map((e) => e.cardId)
}
