import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { getWorkspaceBySlugOrThrow } from '@/db'
import { BoardViewPage } from '@/components/board/BoardViewPage'
import { useWorkspaces } from '@/components/layout/WorkspaceContext'

export const Route = createFileRoute('/$workspaceSlug/$boardId')({
  loader: async ({ params }) => {
    const workspace = await getWorkspaceBySlugOrThrow(params.workspaceSlug)
    return { workspaceId: workspace.id }
  },
  component: WorkspaceBoardPage,
})

function WorkspaceBoardPage() {
  const { workspaceId } = Route.useLoaderData()
  const { boardId } = Route.useParams()
  const { setActiveWorkspace } = useWorkspaces()

  useEffect(() => {
    setActiveWorkspace(workspaceId)
  }, [workspaceId, setActiveWorkspace])

  return <BoardViewPage boardId={boardId} />
}
