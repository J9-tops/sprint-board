import { createFileRoute, Outlet } from '@tanstack/react-router'
import { getWorkspaceBySlugOrThrow } from '@/db'

export const Route = createFileRoute('/$workspaceSlug')({
  loader: async ({ params }) => {
    if (typeof window === 'undefined') {
      return { workspaceSlug: params.workspaceSlug, workspaceId: undefined }
    }
    const workspace = await getWorkspaceBySlugOrThrow(params.workspaceSlug)
    return { workspaceSlug: params.workspaceSlug, workspaceId: workspace.id }
  },
  component: WorkspaceLayout,
})

function WorkspaceLayout() {
  return <Outlet />
}
