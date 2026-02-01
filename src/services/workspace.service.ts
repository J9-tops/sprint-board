/**
 * Workspace service - Business logic for workspace management.
 * Orchestrates database operations and provides a clean API for UI components.
 */

import {
  createWorkspace,
  deleteWorkspace,
  getAllWorkspaces,
  updateWorkspace,
} from '../db'

// ============================================================================
// Workspace Operations
// ============================================================================

/**
 * Create a new workspace.
 */
export async function createWorkspaceService(
  name: string,
  color: string,
): Promise<{ id: string; name: string; color: string }> {
  const workspace = await createWorkspace({ name, color, position: 0 })
  return {
    id: workspace.id,
    name: workspace.name,
    color: workspace.color,
  }
}

/**
 * Get all workspaces.
 */
export async function getWorkspaces(): Promise<
  Array<{ id: string; name: string; color: string }>
> {
  const workspaces = await getAllWorkspaces()
  return workspaces.map((w) => ({
    id: w.id,
    name: w.name,
    color: w.color,
  }))
}

/**
 * Update workspace properties.
 */
export async function updateWorkspaceService(
  workspaceId: string,
  updates: { name?: string; color?: string },
): Promise<{ id: string; name: string; color: string }> {
  const workspace = await updateWorkspace(workspaceId, updates)
  return {
    id: workspace.id,
    name: workspace.name,
    color: workspace.color,
  }
}

/**
 * Delete a workspace.
 */
export async function deleteWorkspaceService(
  workspaceId: string,
): Promise<void> {
  await deleteWorkspace(workspaceId)
}
