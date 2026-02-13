import { createFileRoute, redirect } from '@tanstack/react-router'
import { getAllWorkspaces, getBoardOrThrow } from '@/db'

export const Route = createFileRoute('/board/$boardId')({
  loader: async ({ params }) => {
    const board = await getBoardOrThrow(params.boardId)
    const workspaces = await getAllWorkspaces()

    if (board.workspaceId && workspaces.length > 0) {
      const workspace = workspaces.find((ws) => ws.id === board.workspaceId)
      if (workspace) {
        throw redirect({ to: `/${workspace.slug}/${board.id}` })
      }
    }

    throw redirect({ to: '/' })
  },
  component: () => null,
})
