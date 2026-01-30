import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react';

interface LayoutContextType {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  openSidebar: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)
  const openSidebar = () => setIsSidebarOpen(true)

  return (
    <LayoutContext.Provider
      value={{ isSidebarOpen, toggleSidebar, closeSidebar, openSidebar }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
