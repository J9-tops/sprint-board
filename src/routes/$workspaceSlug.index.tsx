import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { DashboardPage } from '@/components/dashboard/DashboardPage'

export const Route = createFileRoute('/$workspaceSlug/')({
  component: WorkspaceDashboardPage,
})

function WorkspaceDashboardPage() {
  // Use data from the parent route which loads the workspace
  const { workspaceSlug, workspaceId } = useLoaderData({
    from: '/$workspaceSlug',
  })
  return (
    <DashboardPage workspaceSlug={workspaceSlug} workspaceId={workspaceId} />
  )
}
