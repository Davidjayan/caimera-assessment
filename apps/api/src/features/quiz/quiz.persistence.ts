import { AppDataSource } from '../../app/database';
import { Question } from '../../database/entities/Question';
import { Answer } from '../../database/entities/Answer';
import type { QuizQuestion } from './quiz.constants';

/**
 * Persist a question to PostgreSQL (fire-and-forget, no await at call site).
 */
export function persistQuestion(q: QuizQuestion, gameSessionId: string): void {

  const question = Question.create({
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    state: 'open',
    gameSessionId,
  });

  question.save().catch((err) => {
    console.error('❌ Failed to persist question to PG:', err.message);
  });
}

/**
 * Mark a question as closed in PostgreSQL (fire-and-forget).
 */
export function closeQuestion(questionConstantId: string, winnerId: string, gameSessionId: string): void {

  Question
    .update(
      { gameSessionId, question: questionConstantId },
      { state: 'closed', winnerId },
    )
    .catch((err) => {
      console.error('❌ Failed to close question in PG:', err.message);
    });
}

/**
 * Persist an answer to PostgreSQL (fire-and-forget).
 */
export function persistAnswer(
  playerId: string,
  playerName: string,
  questionId: string,
  answer: string,
  isCorrect: boolean,
  gameSessionId: string,
): void {
  const answerEntity = Answer.create({
    playerId,
    playerName,
    questionId,
    answer,
    isCorrect,
    gameSessionId,
  });

  answerEntity.save().catch((err) => {
    console.error('❌ Failed to persist answer to PG:', err.message);
  });
}
