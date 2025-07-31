import { Stack, Typography } from '@mui/material'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getAuth } from '@clerk/tanstack-react-start/server'
import { getWebRequest } from '@tanstack/react-start/server'
import { SignedIn, UserButton, SignedOut, SignInButton } from '@clerk/tanstack-react-start'

const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getWebRequest()
  if (!request) throw new Error('No request found')
  const { userId } = await getAuth(request)

  if (!userId) {
    // This will error because you're redirecting to a path that doesn't exist yet
    // You can create a sign-in route to handle this
    // See https://clerk.com/docs/references/tanstack-start/custom-sign-in-or-up-page
    throw redirect({
      to: '/sign-in',
    })
  }

  return { userId }
})

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
  beforeLoad: async () => await authStateFn(),
  loader: async ({ context }) => {
    return { userId: context.userId }
  },
})

function RouteComponent() {
  const state = Route.useLoaderData()
  return (
    <Stack alignItems="center">
      <Typography variant="h2">Welcome! Your ID is {state.userId}!</Typography>
      <SignedIn>
        <p>You are signed in</p>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <p>You are signed out</p>
        <SignInButton />
      </SignedOut>
    </Stack>
  )
}
