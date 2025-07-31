import { createFileRoute } from '@tanstack/react-router'
import { Stack } from '@mui/material'
import z from 'zod'
import PostCard from '~/components/PostCard'
import StoriesSection from '~/components/StoriesSection'

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    count: z.number().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack alignItems="center">
      <StoriesSection />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
    </Stack>
  )
}
