export type ModalType =
  | 'create-board'
  | 'create-workspace'
  | 'card-detail'
  | 'confirm-delete'

export interface CreateBoardModalProps {
  onClose: () => void
  onCreate: (data: { title: string; background: string }) => void
}

export interface CreateWorkspaceModalProps {
  onClose: () => void
  onCreate: (data: { name: string; color: string }) => void
}

export interface ConfirmDeleteWorkspaceModalProps {
  onClose: () => void
  onConfirm: () => void
  workspaceName: string
}

export interface CardModalProps {
  onClose: () => void
  card: {
    title: string
    labels?: Array<{ name: string; color: string }>
    dueDate?: string
  }
}
