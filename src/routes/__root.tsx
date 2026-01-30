import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { Sidebar } from '../components/layout/Sidebar'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'


import { LayoutProvider, useLayout } from '../components/layout/LayoutContext'
import { ThemeProvider } from '../components/layout/ThemeProvider'
import { TabsProvider } from '../components/layout/TabsContext'
import { TabsBar } from '../components/layout/TabsBar'
import { ModalWrapper } from '../components/layout/ModalWrapper'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'KanbanOffline',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased font-sans bg-background text-foreground">
        <LayoutProvider>
          <ThemeProvider
            defaultTheme="dark"
            storageKey="vite-ui-theme"
            enableSystem
          >
            <TabsProvider>
              <AppShell />
              <ModalWrapper />
            </TabsProvider>
          </ThemeProvider>
        </LayoutProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function AppShell() {
  const { isSidebarOpen, closeSidebar } = useLayout()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TabsBar />
        <main className="flex-1 overflow-y-auto bg-muted/20 relative">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
