// "use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "@tanstack/react-router"
import type React from "react"
import { Box, Typography, TextField, IconButton, Avatar, Paper, InputAdornment, AppBar, Toolbar } from "@mui/material"
import { ArrowBack, Send, AttachFile, EmojiEmotions, Phone, VideoCall, MoreVert, CameraAlt } from "@mui/icons-material"
import type { Message, Conversation } from "~/types"

interface ChatPageProps {
  userId: string
}

export default function ChatList({ userId }: ChatPageProps) {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messageText, setMessageText] = useState("")
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const currentUserId = "current-user"

  // Mock conversation data
  useEffect(() => {
    const conversations: Record<string, Conversation> = {
      "1": {
        id: "1",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Hey! How are you doing?",
        lastMessageTime: new Date(Date.now() - 300000),
        unreadCount: 0,
        isOnline: true,
      },
      "2": {
        id: "2",
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Thanks for the help yesterday!",
        lastMessageTime: new Date(Date.now() - 3600000),
        unreadCount: 0,
        isOnline: false,
      },
      "3": {
        id: "3",
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "See you tomorrow 👋",
        lastMessageTime: new Date(Date.now() - 7200000),
        unreadCount: 0,
        isOnline: true,
      },
      "4": {
        id: "4",
        name: "David Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "The project looks great!",
        lastMessageTime: new Date(Date.now() - 86400000),
        unreadCount: 0,
        isOnline: false,
      },
      "5": {
        id: "5",
        name: "Lisa Park",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Let's catch up soon!",
        lastMessageTime: new Date(Date.now() - 172800000),
        unreadCount: 0,
        isOnline: true,
      },
    }

    setConversation(conversations[userId] || null)

    // Mock messages for each conversation
    const mockMessagesData: Record<string, Message[]> = {
      "1": [
        {
          id: "1",
          text: "Hey! How are you doing?",
          senderId: userId,
          senderName: "Sarah Johnson",
          timestamp: new Date(Date.now() - 300000),
          type: "text",
        },
        {
          id: "2",
          text: "I'm doing great! Just working on some new projects. How about you?",
          senderId: currentUserId,
          senderName: "You",
          timestamp: new Date(Date.now() - 240000),
          type: "text",
        },
        {
          id: "3",
          text: "That sounds exciting! I would love to hear more about it. What kind of projects are you working on?",
          senderId: userId,
          senderName: "Sarah Johnson",
          timestamp: new Date(Date.now() - 180000),
          type: "text",
        },
        {
          id: "4",
          text: "Mainly web development stuff with React and Next.js. Really enjoying the new features!",
          senderId: currentUserId,
          senderName: "You",
          timestamp: new Date(Date.now() - 120000),
          type: "text",
        },
      ],
      "2": [
        {
          id: "1",
          text: "Thanks for the help yesterday!",
          senderId: userId,
          senderName: "Mike Chen",
          timestamp: new Date(Date.now() - 3600000),
          type: "text",
        },
        {
          id: "2",
          text: "No problem! Happy to help anytime.",
          senderId: currentUserId,
          senderName: "You",
          timestamp: new Date(Date.now() - 3540000),
          type: "text",
        },
      ],
      "3": [
        {
          id: "1",
          text: "See you tomorrow 👋",
          senderId: userId,
          senderName: "Emma Wilson",
          timestamp: new Date(Date.now() - 7200000),
          type: "text",
        },
        {
          id: "2",
          text: "Looking forward to it! What time should we meet?",
          senderId: currentUserId,
          senderName: "You",
          timestamp: new Date(Date.now() - 7140000),
          type: "text",
        },
        {
          id: "3",
          text: "How about 2 PM at the usual place?",
          senderId: userId,
          senderName: "Emma Wilson",
          timestamp: new Date(Date.now() - 7080000),
          type: "text",
        },
      ],
      "4": [
        {
          id: "1",
          text: "The project looks great!",
          senderId: userId,
          senderName: "David Rodriguez",
          timestamp: new Date(Date.now() - 86400000),
          type: "text",
        },
        {
          id: "2",
          text: "Thank you! I put a lot of effort into it.",
          senderId: currentUserId,
          senderName: "You",
          timestamp: new Date(Date.now() - 86340000),
          type: "text",
        },
      ],
      "5": [
        {
          id: "1",
          text: "Let's catch up soon!",
          senderId: userId,
          senderName: "Lisa Park",
          timestamp: new Date(Date.now() - 172800000),
          type: "text",
        },
        {
          id: "2",
          text: "It's been too long. How about this weekend?",
          senderId: currentUserId,
          senderName: "You",
          timestamp: new Date(Date.now() - 172740000),
          type: "text",
        },
      ],
    }

    setMessages(mockMessagesData[userId] || [])
  }, [userId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText.trim(),
        senderId: currentUserId,
        senderName: "You",
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, newMessage])
      setMessageText("")

      // Simulate a response after 2 seconds (optional)
      setTimeout(() => {
        const responses = [
          "That's interesting!",
          "I see what you mean.",
          "Thanks for sharing!",
          "Let me think about that.",
          "Good point!",
          "I agree with you.",
          "That makes sense.",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          senderId: userId,
          senderName: conversation?.name || "User",
          timestamp: new Date(),
          type: "text",
        }

        setMessages((prev) => [...prev, responseMessage])
      }, 2000)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleBackClick = () => {
    router.navigate({ to: "/chat" })
  }

  if (!conversation) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Typography>User not found</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8f9fa" }}>
      {/* Chat Header */}
      <AppBar position="static" sx={{ backgroundColor: "white", color: "black", boxShadow: 1 }}>
        <Toolbar sx={{ minHeight: "64px !important" }}>
          <IconButton edge="start" onClick={handleBackClick} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Avatar src={conversation.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="600" sx={{ lineHeight: 1.2 }}>
              {conversation.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
              {conversation.isOnline ? "Active now" : "Last seen recently"}
            </Typography>
          </Box>
          <IconButton color="inherit">
            <Phone />
          </IconButton>
          <IconButton color="inherit">
            <VideoCall />
          </IconButton>
          <IconButton color="inherit">
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId === currentUserId
          const showAvatar = !isOwnMessage && (index === 0 || messages[index - 1].senderId !== message.senderId)

          return (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: 1,
                mb: 0.5,
                px: 1,
              }}
            >
              {!isOwnMessage && (
                <Avatar
                  src={conversation.avatar}
                  sx={{
                    width: 28,
                    height: 28,
                    visibility: showAvatar ? "visible" : "hidden",
                  }}
                />
              )}
              <Paper
                sx={{
                  p: 1.5,
                  maxWidth: "75%",
                  backgroundColor: isOwnMessage ? "#1877f2" : "white",
                  color: isOwnMessage ? "white" : "text.primary",
                  borderRadius: 2,
                  borderTopLeftRadius: !isOwnMessage && showAvatar ? 1 : 2,
                  borderTopRightRadius: isOwnMessage ? 1 : 2,
                  wordBreak: "break-word",
                }}
              >
                <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    opacity: 0.7,
                    fontSize: "0.7rem",
                  }}
                >
                  {formatMessageTime(message.timestamp)}
                </Typography>
              </Paper>
            </Box>
          )
        })}

        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "white",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
        }}
      >
        <IconButton color="primary" sx={{ mb: 0.5 }}>
          <CameraAlt />
        </IconButton>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <AttachFile />
                </IconButton>
                <IconButton size="small">
                  <EmojiEmotions />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "#f0f2f5",
              border: "none",
              "& fieldset": {
                border: "none",
              },
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
          sx={{
            mb: 0.5,
            backgroundColor: messageText.trim() ? "#1877f2" : "transparent",
            color: messageText.trim() ? "white" : "inherit",
            "&:hover": {
              backgroundColor: messageText.trim() ? "#166fe5" : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </Box>
  )
}
