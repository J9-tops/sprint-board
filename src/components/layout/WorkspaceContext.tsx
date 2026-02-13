import { createContext, useContext, useEffect, useState } from 'react'
import { getWorkspaces as getWorkspacesService } from '@/services/workspace.service'
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/lib/cookie-storage'

interface Workspace {
  id: string
  name: string
  color: string
}

interface WorkspaceContextValue {
  workspaces: Array<Workspace>
  activeWorkspaceId: string | null
  activeWorkspace: Workspace | null
  isLoadingWorkspaces: boolean
  setActiveWorkspace: (id: string | null) => void
  refreshWorkspaces: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined,
)

interface WorkspaceProviderProps {
  children: React.ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [workspaces, setWorkspaces] = useState<Array<Workspace>>([])
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<
    string | null
  >(null)
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false)

  useEffect(() => {
    loadWorkspaces()
    loadActiveWorkspace()
  }, [])

  const loadWorkspaces = async () => {
    setIsLoadingWorkspaces(true)
    try {
      const ws = await getWorkspacesService()
      setWorkspaces(ws)
    } catch (e) {
      console.error('Failed to load workspaces:', e)
    } finally {
      setIsLoadingWorkspaces(false)
    }
  }

  const loadActiveWorkspace = () => {
    try {
      const savedId = getLocalStorageItem<string | null>(
        'active-workspace-id',
        null,
      )
      setActiveWorkspaceIdState(savedId)
    } catch (e) {
      console.error('Failed to load active workspace:', e)
    }
  }

  const setActiveWorkspace = (id: string | null) => {
    try {
      setActiveWorkspaceIdState(id)
      if (id === null) {
        removeLocalStorageItem('active-workspace-id')
      } else {
        setLocalStorageItem('active-workspace-id', id)
      }
    } catch (e) {
      console.error('Failed to set active workspace:', e)
    }
  }

  const activeWorkspace =
    activeWorkspaceId && workspaces.length > 0
      ? workspaces.find((w) => w.id === activeWorkspaceId) || null
      : null

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspaceId,
        activeWorkspace,
        isLoadingWorkspaces,
        setActiveWorkspace,
        refreshWorkspaces: loadWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspaces() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspaces must be used within a WorkspaceProvider')
  }
  return context
}
