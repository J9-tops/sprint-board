import React from 'react'
import { File, X } from 'lucide-react'
import { useTabs } from './TabsContext'
import { cn } from '@/lib/utils'

export function TabsBar() {
  const { tabs, activeTabId, closeTab, setActiveTab } = useTabs()

  if (tabs.length === 0) return null

  return (
    <div className="flex bg-muted/20 border-b overflow-x-auto min-h-[35px] h-[35px] items-end px-0 gap-[1px] no-scrollbar w-full select-none">
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id
        return (
          <div
            key={tab.id}
            className={cn(
              'group flex items-center gap-2 px-3 py-1.5 min-w-[120px] max-w-[200px] h-full text-xs cursor-pointer select-none transition-colors border-r border-border/40 relative',
              isActive
                ? 'bg-background text-foreground font-medium border-t-2 border-t-primary'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground',
            )}
            onClick={() => setActiveTab(tab.id)}
            role="button"
            tabIndex={0}
          >
            <span
              className={cn('shrink-0 opacity-70', isActive && 'text-primary')}
            >
              {React.isValidElement(tab.icon) ? tab.icon : <File size={13} />}
            </span>

            <span className="truncate flex-1">{tab.title}</span>

            <div
              className={cn(
                'p-0.5 rounded-sm hover:bg-muted-foreground/20 transition-all',
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
              )}
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
            >
              <X size={12} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
