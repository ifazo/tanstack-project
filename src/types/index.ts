export interface Message {
  _id: string
  text: string
  senderId: string
  attachments: string[]
  createdAt: Date
}

export interface Chat {
  _id: string
  type: "personal" | "group"
  participants: User[]
  name: string
  image: string
  messages: Message[],
  lastMessage?: Message
  createdAt: Date
}

export interface Conversation {
  _id: string
  chats: Chat[],
  total: number
}

export interface User {
  _id: string
  name: string
  avatar: string
  isOnline: boolean
}
