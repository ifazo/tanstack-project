/// <reference types="vite/client" />
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { CacheProvider } from '@emotion/react'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import createCache from '@emotion/cache'
import fontsourceVariableRobotoCss from '@fontsource-variable/roboto?url'
import React from 'react'
import { theme } from '~/setup/theme'
import Topbar from '~/components/Topbar'
import Navbar from '~/components/Navbar'
import { ClerkProvider } from '@clerk/tanstack-react-start'

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: 'stylesheet', href: fontsourceVariableRobotoCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function Providers({ children }: { children: React.ReactNode }) {
  const emotionCache = createCache({ key: 'css' })

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
      <ClerkProvider>
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          <Topbar />
          <Container component="main" sx={{ paddingBlock: 4 }}>
            {children}
          </Container>
          <Navbar />
        </Providers>

        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
     </ClerkProvider>
  )
}
