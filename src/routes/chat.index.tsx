import { createFileRoute } from '@tanstack/react-router'
import ConversationList from '~/components/ConversationList'

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <ConversationList />
    </div>
  )
}
