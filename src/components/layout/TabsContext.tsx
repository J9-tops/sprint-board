import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/cookie-storage'

export interface Tab {
  id: string
  title: string
  path: string
  icon?: React.ReactNode
}

interface TabsContextType {
  tabs: Array<Tab>
  activeTabId: string | null
  addTab: (tab: Tab) => void
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
  deselectAllTabs: () => void
  reorderTabs: (newTabs: Array<Tab>) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Array<Tab>>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  function debounce<T extends (...args: Array<any>) => any>(
    func: T,
    delay: number,
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null
    return (...args: Parameters<T>) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  useEffect(() => {
    const savedTabs = getLocalStorageItem<Array<Tab>>('workspace-tabs', [])
    const savedActiveTabId = getLocalStorageItem<string | null>(
      'workspace-active-tab',
      null,
    )

    if (savedTabs.length > 0) {
      const validTabs = savedTabs.filter(
        (tab) => tab.path && typeof tab.path === 'string',
      )
      setTabs(validTabs)
      if (
        savedActiveTabId &&
        validTabs.some((t) => t.id === savedActiveTabId)
      ) {
        setActiveTabId(savedActiveTabId)
      } else if (validTabs.length > 0) {
        setActiveTabId(validTabs[0].id)
      }
    }
  }, [])

  const saveTabsRef = useRef<(() => void) | null>(null)
  const saveActiveTabRef = useRef<((id: string | null) => void) | null>(null)

  useEffect(() => {
    if (!saveTabsRef.current) {
      saveTabsRef.current = debounce(() => {
        if (tabs.length > 0) {
          const tabsToSave = tabs.map(({ icon, ...rest }) => rest)
          setLocalStorageItem('workspace-tabs', tabsToSave)
        } else {
          setLocalStorageItem('workspace-tabs', [])
        }
      }, 500)
    }
    saveTabsRef.current()
  }, [tabs])

  useEffect(() => {
    if (!saveActiveTabRef.current) {
      saveActiveTabRef.current = debounce((id: string | null) => {
        setLocalStorageItem('workspace-active-tab', id)
      }, 500)
    }
    saveActiveTabRef.current(activeTabId)
  }, [activeTabId])

  useEffect(() => {
    const currentPath = location.pathname
    const matchingTab = tabs.find((t) => t.path === currentPath)
    if (matchingTab) {
      setActiveTabId(matchingTab.id)
    } else if (currentPath === '/' && tabs.length > 0) {
    
    } else if (tabs.length > 0 && !activeTabId) {

    }
  }, [location.pathname, tabs])

  const addTab = (tab: Tab) => {
    setTabs((prev) => {
      if (prev.some((t) => t.id === tab.id)) return prev
      return [...prev, tab]
    })
    setActiveTabId(tab.id)
    if (location.pathname !== tab.path) {
      navigate({ to: tab.path })
    }
  }

  const closeTab = (id: string) => {
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.id !== id)

      if (id === activeTabId) {
        if (newTabs.length > 0) {
          const lastTab = newTabs[newTabs.length - 1]
          setActiveTabId(lastTab.id)
          navigate({ to: lastTab.path })
        } else {
          setActiveTabId(null)
          navigate({ to: '/' })
        }
      }
      return newTabs
    })
  }

  const manualSetActiveTab = (id: string) => {
    const tab = tabs.find((t) => t.id === id)
    if (tab) {
      setActiveTabId(id)
      navigate({ to: tab.path })
    }
  }

  const deselectAllTabs = () => {
    setActiveTabId(null)
    navigate({ to: '/' })
  }

  const reorderTabs = (newTabs: Array<Tab>) => {
    setTabs(newTabs)
  }

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeTabId,
        addTab,
        closeTab,
        setActiveTab: manualSetActiveTab,
        deselectAllTabs,
        reorderTabs,
      }}
    >
      {children}
    </TabsContext.Provider>
  )
}

export function useTabs() {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider')
  }
  return context
}
