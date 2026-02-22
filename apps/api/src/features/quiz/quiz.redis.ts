import { getRedisClient } from '../../app/redis';
import type { QuizQuestion } from './quiz.constants';

const ACTIVE_QUESTION_KEY = 'quiz:active_question';
const LEADERBOARD_KEY = 'quiz:leaderboard';
const PLAYER_NAMES_KEY = 'quiz:player_names';

function answeredKey(questionId: string): string {
  return `quiz:answered:${questionId}`;
}

/**
 * Store the active question in Redis (without correct answer).
 */
export async function setActiveQuestion(
  question: QuizQuestion,
  gameSessionId: string,
): Promise<void> {
  const redis = getRedisClient();
  await redis.hmset(ACTIVE_QUESTION_KEY, {
    id: question.id,
    question: question.question,
    options: JSON.stringify(question.options),
    gameSessionId,
    state: 'open',
    timestamp: Date.now().toString(),
  });
  // TTL of 90s (buffer over 60s timer)
  await redis.expire(ACTIVE_QUESTION_KEY, 90);
}

/**
 * Get the current active question from Redis.
 */
export async function getActiveQuestion(): Promise<Record<string, string> | null> {
  const redis = getRedisClient();
  const data = await redis.hgetall(ACTIVE_QUESTION_KEY);
  if (!data || !data.id) return null;
  return data;
}

/**
 * Check if a question has already been correctly answered.
 */
export async function isQuestionAnswered(questionId: string): Promise<boolean> {
  const redis = getRedisClient();
  const exists = await redis.exists(answeredKey(questionId));
  return exists === 1;
}

/**
 * Mark a question as answered by a player.
 */
export async function markQuestionAnswered(
  questionId: string,
  playerId: string,
): Promise<void> {
  const redis = getRedisClient();
  await redis.set(answeredKey(questionId), playerId, 'EX', 300);
  await redis.hset(ACTIVE_QUESTION_KEY, 'state', 'closed');
}

/**
 * Get who answered a question first.
 */
export async function getQuestionWinner(questionId: string): Promise<string | null> {
  const redis = getRedisClient();
  return redis.get(answeredKey(questionId));
}

/**
 * Update a player's score in the leaderboard sorted set.
 */
export async function updateScore(playerId: string, points: number): Promise<void> {
  const redis = getRedisClient();
  await redis.zincrby(LEADERBOARD_KEY, points, playerId);
}

/**
 * Get the leaderboard (top scores descending).
 */
export async function getLeaderboard(): Promise<{ playerId: string; score: number; playerName: string }[]> {
  const redis = getRedisClient();
  const results = await redis.zrevrange(LEADERBOARD_KEY, 0, -1, 'WITHSCORES');
  const leaderboard: { playerId: string; score: number; playerName: string }[] = [];

  for (let i = 0; i < results.length; i += 2) {
    const playerId = results[i];
    const score = parseInt(results[i + 1], 10);
    const playerName = (await redis.hget(PLAYER_NAMES_KEY, playerId)) ?? playerId;
    leaderboard.push({ playerId, score, playerName });
  }

  return leaderboard;
}

/**
 * Register a player name.
 */
export async function setPlayerName(playerId: string, name: string): Promise<void> {
  const redis = getRedisClient();
  await redis.hset(PLAYER_NAMES_KEY, playerId, name);
}

/**
 * Get a player's name.
 */
export async function getPlayerName(playerId: string): Promise<string | null> {
  const redis = getRedisClient();
  return redis.hget(PLAYER_NAMES_KEY, playerId);
}

/**
 * Clear active question from Redis.
 */
export async function clearActiveQuestion(): Promise<void> {
  const redis = getRedisClient();
  await redis.del(ACTIVE_QUESTION_KEY);
}

/**
 * Reset the leaderboard scores. Player names are preserved.
 */
export async function resetLeaderboard(): Promise<void> {
  const redis = getRedisClient();
  await redis.del(LEADERBOARD_KEY);
}
