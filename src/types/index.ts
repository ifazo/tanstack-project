export interface Message {
  id: string
  text: string
  senderId: string
  senderName: string
  timestamp: Date
  type: "text" | "image" | "file"
}

export interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  isOnline: boolean
  isTyping?: boolean
}

export interface User {
  id: string
  name: string
  avatar: string
  isOnline: boolean
}
