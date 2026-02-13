import { createFileRoute } from '@tanstack/react-router'
import { getWorkspaceBySlugOrThrow } from '@/db'
import { DashboardPage } from '@/components/dashboard/DashboardPage'

export const Route = createFileRoute('/$workspaceSlug')({
  loader: async ({ params }) => {
    if (typeof window === 'undefined') {
      return { workspaceSlug: params.workspaceSlug, workspaceId: undefined }
    }
    const workspace = await getWorkspaceBySlugOrThrow(params.workspaceSlug)
    return { workspaceSlug: params.workspaceSlug, workspaceId: workspace.id }
  },
  component: WorkspaceDashboardPage,
})

function WorkspaceDashboardPage() {
  const { workspaceSlug, workspaceId } = Route.useLoaderData()
  return (
    <DashboardPage workspaceSlug={workspaceSlug} workspaceId={workspaceId} />
  )
}
