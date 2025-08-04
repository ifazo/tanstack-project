import { createFileRoute, useParams } from '@tanstack/react-router'
import ChatList from '~/components/ChatList'

export const Route = createFileRoute('/chat/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = useParams({ from: '/chat/$userId' })
  return (
  <div>
    <ChatList userId={userId} />
  </div>
  )
}
