import { Router } from 'express';
import * as quizService from './quiz.service';

export const quizRouter = Router();

/**
 * GET /quiz/leaderboard
 */
quizRouter.get('/leaderboard', async (_req, res) => {
  try {
    const leaderboard = await quizService.getLeaderboard();
    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});
