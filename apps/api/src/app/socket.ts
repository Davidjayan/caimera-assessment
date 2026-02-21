import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { getRedisClient } from './redis';
import type { Server as HttpServer } from 'http';

export function createSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN ?? '*',
      methods: ['GET', 'POST'],
    },
  });

  const pubClient = getRedisClient();
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}
