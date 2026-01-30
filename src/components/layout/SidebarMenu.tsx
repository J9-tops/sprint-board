import { Database, Home } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useTabs } from './TabsContext'
import { Button } from '@/components/ui/button'

const menuItems = [
  { icon: Home, label: 'Home', to: '/', isHome: true },
  { icon: Database, label: 'Storage', to: '/settings/storage', isHome: false },
]

export function SidebarMenu() {
  const { deselectAllTabs } = useTabs()

  return (
    <nav className="flex flex-col gap-1">
      <p className="text-[10px] font-bold text-muted-foreground px-2 mb-2 uppercase tracking-[0.15em]">
        Menu
      </p>
      {menuItems.map((item) => (
        <div key={item.label}>
          {item.isHome ? (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 px-3 text-sm text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => deselectAllTabs()}
            >
              <item.icon
                size={18}
                className="text-muted-foreground group-hover:text-foreground"
              />
              <span className="font-medium text-muted-foreground group-hover:text-foreground">
                {item.label}
              </span>
            </Button>
          ) : (
            <Link
              to={item.to}
              activeProps={{ className: 'bg-secondary text-foreground' }}
              inactiveProps={{ className: 'text-muted-foreground' }}
              className="block group"
            >
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-3 h-11 px-3 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <item.icon
                    size={18}
                    className={
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-foreground'
                    }
                  />
                  <span
                    className={
                      isActive
                        ? 'font-semibold text-foreground'
                        : 'font-medium text-muted-foreground group-hover:text-foreground'
                    }
                  >
                    {item.label}
                  </span>
                </Button>
              )}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
