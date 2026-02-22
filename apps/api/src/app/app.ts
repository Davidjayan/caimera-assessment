import express from 'express';
import { healthRouter } from '../features/health/health.router';
import { quizRouter } from '../features/quiz/quiz.router';

export function createApp(): express.Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Feature routers
  app.use('/health', healthRouter);
  app.use('/quiz', quizRouter);

  return app;
}
