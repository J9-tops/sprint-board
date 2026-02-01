import { useEffect } from 'react'
import type { ModalState } from '@/stores/modals'
import { useModalStore } from '@/stores/modals'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useMediaQuery } from '@/hooks/use-media-query'
import { CreateBoardModalContent } from '@/components/dashboard/modal/CreateBoardModal'
import { CreateWorkspaceModalContent } from '@/components/dashboard/modal/CreateWorkspaceModal'
import { ConfirmDeleteWorkspaceModal } from '@/components/dashboard/modal/ConfirmDeleteWorkspaceModal'
import { CardModalContent } from '@/components/board/modal/CardModal'

function renderModal(modalState: ModalState, closeModal: () => void) {
  switch (modalState.modalType) {
    case 'create-workspace': {
      const props = modalState.data as
        | {
            onCreate?: (data: { name: string; color: string }) => void
            workspaceId?: string
            initialName?: string
            initialColor?: string
          }
        | undefined
      return (
        <CreateWorkspaceModalContent
          onClose={closeModal}
          onCreate={props?.onCreate ?? (() => {})}
          workspaceId={props?.workspaceId}
          initialName={props?.initialName}
          initialColor={props?.initialColor}
        />
      )
    }
    case 'create-board': {
      const props = modalState.data as
        | {
            onCreate?: (data: { title: string; background: string }) => void
          }
        | undefined
      return (
        <CreateBoardModalContent
          onClose={closeModal}
          onCreate={props?.onCreate ?? (() => {})}
        />
      )
    }
    case 'card-detail': {
      type CardData = {
        card?: {
          title: string
          labels?: Array<{ name: string; color: string }>
          dueDate?: string
        }
      }
      const props = modalState.data as CardData | undefined
      return (
        <CardModalContent
          onClose={closeModal}
          card={props?.card ?? { title: 'Untitled' }}
        />
      )
    }
    case 'confirm-delete-workspace': {
      const props = modalState.data as
        | {
            workspaceName?: string
            onConfirm?: () => void
          }
        | undefined
      return (
        <ConfirmDeleteWorkspaceModal
          onClose={closeModal}
          onConfirm={props?.onConfirm ?? (() => {})}
          workspaceName={props?.workspaceName ?? 'this workspace'}
        />
      )
    }
    default:
      return null
  }
}

export function ModalWrapper() {
  const { modalState, closeModal } = useModalStore()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isOpen = modalState.status === 'open'

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  if (modalState.modalType === 'card-detail') {
    if (isDesktop) {
      return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && closeModal()}>
          <SheetContent
            side="right"
            className="p-0 sm:max-w-200 border-l-border/50 shadow-2xl"
            showCloseButton={false}
          >
            {renderModal(modalState, closeModal)}
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && closeModal()}>
        <DrawerContent className="h-[95vh] p-0 focus:outline-none">
          {renderModal(modalState, closeModal)}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="p-0 bg-card border-none shadow-2xl overflow-hidden">
        {renderModal(modalState, closeModal)}
      </DialogContent>
    </Dialog>
  )
}
