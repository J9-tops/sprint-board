export type ModalType = 'create-board' | 'card-detail' | 'confirm-delete'

// Props for CreateBoardModal
export interface CreateBoardModalProps {
  onClose: () => void
  onCreate: (data: { title: string; background: string }) => void
}

// Props for CardModal
export interface CardModalProps {
  onClose: () => void
  card: {
    title: string
    labels?: Array<{ name: string; color: string }>
    dueDate?: string
  }
}

// Props for ConfirmDeleteModal
export interface ConfirmDeleteModalProps {
  onClose: () => void
  title: string
  message: string
  onConfirm: () => void
}
