import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ChatList from "~/components/ChatList";
import { getToken, getUser } from "~/store";
import { Chat } from "~/types";

export const Route = createFileRoute("/chat/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chatId } = useParams({ from: "/chat/$chatId" });
  const token = getToken();

  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/chats/${chatId}/messages`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setChat(data);
        console.log("Fetched user chat messages:", data);
      } catch (err) {
        setError("Failed to fetch chat messages");
        console.error("Failed to fetch chat messages", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [chatId])

  return (
    <div>
      {chat && <ChatList chat={chat} loading={loading} error={error} />}
    </div>
  );
}
