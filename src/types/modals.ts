export type ModalType = 'create-board' | 'card-detail' | 'confirm-delete'

export interface CreateBoardModalProps {
  onClose: () => void
  onCreate: (data: { title: string; background: string }) => void
}

export interface CardModalProps {
  onClose: () => void
  card: {
    title: string
    labels?: Array<{ name: string; color: string }>
    dueDate?: string
  }
}
