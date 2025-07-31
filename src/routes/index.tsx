import { createFileRoute } from '@tanstack/react-router'
import { Stack, Typography } from '@mui/material'
import z from 'zod'

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    count: z.number().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack alignItems="center">
      <Typography variant="h1" marginBlockEnd={4}>
        Welcome to Home page!
      </Typography>
    </Stack>
  )
}
