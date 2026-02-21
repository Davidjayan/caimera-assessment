import 'reflect-metadata';
import { createServer } from 'http';
import { AppDataSource } from './app/database';
import { createApp } from './app/app';
import { createSocketServer } from './app/socket';

const PORT = process.env.PORT ?? 3333;

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const app = createApp();
  const httpServer = createServer(app);

  createSocketServer(httpServer);
  console.log('✅ Socket.IO attached');

  httpServer.listen(PORT, () => {
    console.log(`🚀 API listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start server', err);
  process.exit(1);
});
