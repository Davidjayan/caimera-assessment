'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';
    socket = io(`${url}/quiz`, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });
  }
  return socket;
}
