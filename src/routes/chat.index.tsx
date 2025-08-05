import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import ConversationList from '~/components/ConversationList'
import { Conversation } from '~/types'

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = "6890ec8ec286a994f8a2240d"

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch(`http://localhost:5000/api/chats/personal/${userId}`)
        const data = await res.json()
        setConversations(data)
        console.log("Fetched conversations:", data)
      } catch (err) {
        setError("Failed to fetch conversations")
        console.error("Failed to fetch conversations", err)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [userId])
  return (
    <div>
      <ConversationList />
    </div>
  )
}
