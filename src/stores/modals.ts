import { create } from 'zustand'

export type ModalType = 'create-board' | 'card-detail' | 'confirm-delete'

export interface ModalState {
  status: 'open' | 'close'
  modalType: ModalType
  data?: Record<string, unknown>
}

interface ModalStore {
  modalState: ModalState
  openModal: (type: ModalType, data?: Record<string, unknown>) => void
  closeModal: () => void
}

export const useModalStore = create<ModalStore>()((set, get) => ({
  modalState: { status: 'close', modalType: 'create-board' },

  openModal: (type, data) => {
    set({ modalState: { status: 'open', modalType: type, data } })
  },

  closeModal: () => {
    set({
      modalState: {
        status: 'close',
        modalType: get().modalState.modalType,
      },
    })
  },
}))
