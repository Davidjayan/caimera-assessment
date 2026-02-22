import {
  QUESTIONS,
  POINTS_PER_CORRECT,
  MAX_QUESTIONS_PER_GAME,
  type QuizQuestion,
} from './quiz.constants';
import * as quizRedis from './quiz.redis';

/**
 * Pick N random questions from the bank, shuffled.
 */
export function pickQuestions(count: number = MAX_QUESTIONS_PER_GAME): QuizQuestion[] {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get a sanitised question for clients (no correct answer).
 */
export function sanitiseQuestion(q: QuizQuestion) {
  return {
    id: q.id,
    question: q.question,
    options: q.options,
    difficulty: q.difficulty,
  };
}

/**
 * Store active question in Redis.
 */
export async function broadcastQuestion(
  question: QuizQuestion,
  gameSessionId: string,
): Promise<void> {
  await quizRedis.setActiveQuestion(question, gameSessionId);
}

/**
 * Submit an answer. Returns result object.
 */
export async function submitAnswer(
  questionId: string,
  answer: string,
  playerId: string,
  correctAnswer: string,
): Promise<{
  isCorrect: boolean;
  alreadyAnswered: boolean;
  winnerId: string | null;
  points: number;
}> {
  // Check if already answered
  const alreadyAnswered = await quizRedis.isQuestionAnswered(questionId);

  if (alreadyAnswered) {
    const winnerId = await quizRedis.getQuestionWinner(questionId);
    return { isCorrect: false, alreadyAnswered: true, winnerId, points: 0 };
  }

  const isCorrect = answer === correctAnswer;

  if (isCorrect) {
    await quizRedis.markQuestionAnswered(questionId, playerId);
    await quizRedis.updateScore(playerId, POINTS_PER_CORRECT);
  }

  return {
    isCorrect,
    alreadyAnswered: false,
    winnerId: isCorrect ? playerId : null,
    points: isCorrect ? POINTS_PER_CORRECT : 0,
  };
}

/**
 * Get the leaderboard.
 */
export async function getLeaderboard() {
  return quizRedis.getLeaderboard();
}

/**
 * Register player name.
 */
export async function registerPlayer(playerId: string, name: string) {
  await quizRedis.setPlayerName(playerId, name);
}

/**
 * Get a player's name from Redis.
 */
export async function getPlayerName(playerId: string): Promise<string | null> {
  return quizRedis.getPlayerName(playerId);
}

/**
 * Reset game state.
 */
export async function resetGame() {
  await quizRedis.clearActiveQuestion();
  await quizRedis.resetLeaderboard();
}
