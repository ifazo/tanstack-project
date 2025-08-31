import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000/api', {
      transports: ['websocket'],
      timeout: 5000,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to server:', socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};