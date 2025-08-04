"use client"
import { useEffect, useRef } from "react"
import { io, type Socket } from "socket.io-client"

export function useSocket(serverPath: string) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = io(serverPath, {
      transports: ["websocket", "polling"],
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [serverPath])

  return socketRef.current
}
