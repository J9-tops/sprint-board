import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { getCookie, setCookie } from "@/lib/cookie-storage"

export interface Tab {
  id: string;
  title: string;
  path: string;
  icon?: React.ReactNode;
}

interface TabsContextType {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Tab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  reorderTabs: (newTabs: Tab[]) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize tabs from cookies
  useEffect(() => {
    const savedTabs = getCookie('workspace-tabs');
    if (savedTabs) {
      try {
        setTabs(JSON.parse(savedTabs));
      } catch (e) {
        console.error("Failed to parse tabs", e);
      }
    }
  }, []);

  // Save tabs to cookies
  useEffect(() => {
    if (tabs.length > 0) {
      setCookie('workspace-tabs', JSON.stringify(tabs));
    }
  }, [tabs]);

  // Sync active tab with location
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingTab = tabs.find(t => t.path === currentPath);
    if (matchingTab) {
      setActiveTabId(matchingTab.id);
    } else if (tabs.length > 0 && !activeTabId) {
        // If we have tabs but none match current path, maybe just generic handling?
        // Ideally we might want to Add a tab for the current page if it's a board?
    }
  }, [location.pathname, tabs]);

  const addTab = (tab: Tab) => {
    setTabs(prev => {
      if (prev.some(t => t.id === tab.id)) return prev;
      return [...prev, tab];
    });
    setActiveTabId(tab.id);
    // Navigate to it
    if (location.pathname !== tab.path) {
        navigate({ to: tab.path });
    }
  };

  const closeTab = (id: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== id);
      
      // If closing active tab, switch to another
      if (id === activeTabId) {
        if (newTabs.length > 0) {
          const lastTab = newTabs[newTabs.length - 1];
          setActiveTabId(lastTab.id);
          navigate({ to: lastTab.path });
        } else {
          setActiveTabId(null);
          navigate({ to: '/' });
        }
      }
      return newTabs;
    });
  };

  const manualSetActiveTab = (id: string) => {
    const tab = tabs.find(t => t.id === id);
    if (tab) {
      setActiveTabId(id);
      navigate({ to: tab.path });
    }
  };

  const reorderTabs = (newTabs: Tab[]) => {
    setTabs(newTabs);
  };

  return (
    <TabsContext.Provider value={{ tabs, activeTabId, addTab, closeTab, setActiveTab: manualSetActiveTab, reorderTabs }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
}
