// "use client"
import { useState } from "react"
import { useRouter } from "@tanstack/react-router"
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  TextField,
  InputAdornment,
  AppBar,
  Toolbar,
  IconButton,
  Fab,
} from "@mui/material"
import { Search, Edit, Settings, MoreVert } from "@mui/icons-material"
import { Conversation } from "~/types"

export default function ConversationList() {
  const router = useRouter()

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=56&width=56",
      lastMessage: "Hey! How are you doing?",
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "2",
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=56&width=56",
      lastMessage: "Thanks for the help yesterday!",
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "3",
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=56&width=56",
      lastMessage: "See you tomorrow 👋",
      lastMessageTime: new Date(Date.now() - 7200000),
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: "4",
      name: "David Rodriguez",
      avatar: "/placeholder.svg?height=56&width=56",
      lastMessage: "The project looks great!",
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "5",
      name: "Lisa Park",
      avatar: "/placeholder.svg?height=56&width=56",
      lastMessage: "Let's catch up soon!",
      lastMessageTime: new Date(Date.now() - 172800000),
      unreadCount: 3,
      isOnline: true,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days === 1) return "yesterday"
    return `${days}d`
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleConversationClick = (userId: string) => {
    // Mark conversation as read when clicked
    setConversations((prev) => prev.map((conv) => (conv.id === userId ? { ...conv, unreadCount: 0 } : conv)))

    router.navigate({ to: "/chat/$userId", params: { userId } })
  }

  return (
    <Box sx={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: "white", color: "black", boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Chats
          </Typography>
          <IconButton color="inherit">
            <Settings />
          </IconButton>
          <IconButton color="inherit">
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Search Bar */}
      <Box sx={{ p: 2, backgroundColor: "white", borderBottom: "1px solid #e0e0e0" }}>
        <TextField
          fullWidth
          placeholder="Search conversations"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "text.secondary" }} />
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
      </Box>

      {/* Conversations List */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ p: 0 }}>
          {filteredConversations.map((conversation) => (
            <ListItem
              key={conversation.id}
              onClick={() => handleConversationClick(conversation.id)}
              sx={{
                py: 2,
                px: 2,
                borderBottom: "1px solid #f0f0f0",
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                },
                "&:active": {
                  backgroundColor: "#e3f2fd",
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: conversation.isOnline ? "#44b700" : "transparent",
                      color: conversation.isOnline ? "#44b700" : "transparent",
                      width: 14,
                      height: 14,
                      border: "2px solid white",
                    },
                  }}
                >
                  <Avatar src={conversation.avatar} sx={{ width: 56, height: 56 }} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                sx={{ ml: 2 }}
                primary={
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={conversation.unreadCount > 0 ? 600 : 400}
                      sx={{ fontSize: "1rem" }}
                    >
                      {conversation.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {conversation.lastMessageTime && (
                        <Typography
                          variant="caption"
                          color={conversation.unreadCount > 0 ? "primary" : "text.secondary"}
                          sx={{ fontSize: "0.8rem", fontWeight: conversation.unreadCount > 0 ? 600 : 400 }}
                        >
                          {formatTime(conversation.lastMessageTime)}
                        </Typography>
                      )}
                      {conversation.unreadCount > 0 && (
                        <Badge
                          badgeContent={conversation.unreadCount}
                          color="primary"
                          sx={{
                            "& .MuiBadge-badge": {
                              fontSize: "0.7rem",
                              height: 20,
                              minWidth: 20,
                            },
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: conversation.unreadCount > 0 ? 500 : 400,
                      fontSize: "0.9rem",
                    }}
                  >
                    {conversation.lastMessage || "No messages yet"}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          backgroundColor: "#1877f2",
          "&:hover": {
            backgroundColor: "#166fe5",
          },
        }}
      >
        <Edit />
      </Fab>
    </Box>
  )
}
