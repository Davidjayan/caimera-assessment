import express from 'express';
import { healthRouter } from '../features/health/health.router';

export function createApp(): express.Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Feature routers
  app.use('/health', healthRouter);

  return app;
}
