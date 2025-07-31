import { createFileRoute } from '@tanstack/react-router'
import { Stack, Typography } from '@mui/material'
import { SignedIn, UserButton, SignedOut, SignInButton } from '@clerk/tanstack-react-start'

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack alignItems="center">
      <Typography variant="h2">Sign in page!</Typography>
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