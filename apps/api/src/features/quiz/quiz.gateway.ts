import type { Server, Socket } from 'socket.io';
import { QUESTION_TIMER_SECONDS } from './quiz.constants';
import type { QuizQuestion } from './quiz.constants';
import * as quizService from './quiz.service';
import * as persistence from './quiz.persistence';

interface GameState {
  questions: QuizQuestion[];
  currentIndex: number;
  timer: ReturnType<typeof setInterval> | null;
  secondsLeft: number;
  gameId: string;
  isActive: boolean;
  answeredPlayers: Set<string>;
}

const gameState: GameState = {
  questions: [],
  currentIndex: -1,
  timer: null,
  secondsLeft: 0,
  gameId: '',
  isActive: false,
  answeredPlayers: new Set(),
};

/**
 * Mount quiz Socket.IO event handlers on the server.
 */
export function registerQuizGateway(io: Server): void {
  const quizNamespace = io.of('/quiz');

  quizNamespace.on('connection', (socket: Socket) => {
    console.log(`🎮 Quiz player connected: ${socket.id}`);

    // --- Join game ---
    socket.on('join_game', async (data: { playerName: string }) => {
      const playerName = data.playerName?.trim() || `Player-${socket.id.slice(0, 4)}`;
      await quizService.registerPlayer(socket.id, playerName);

      socket.emit('joined', {
        playerId: socket.id,
        playerName,
      });

      // Send current leaderboard
      const leaderboard = await quizService.getLeaderboard();
      quizNamespace.emit('leaderboard_update', leaderboard);

      // Broadcast updated player count
      quizNamespace.emit('player_count', { count: quizNamespace.sockets.size });

      // If a game is active, send current question
      if (gameState.isActive && gameState.currentIndex >= 0) {
        const currentQ = gameState.questions[gameState.currentIndex];
        socket.emit('question', {
          ...quizService.sanitiseQuestion(currentQ),
          questionNumber: gameState.currentIndex + 1,
          totalQuestions: gameState.questions.length,
          secondsLeft: gameState.secondsLeft,
        });
      }

      console.log(`Player joined: ${playerName}`);
    });

    // --- Start game (any player can trigger) ---
    socket.on('start_game', async () => {
      if (gameState.isActive) {
        socket.emit('error_message', { message: 'A game is already in progress.' });
        return;
      }

      const playerCount = quizNamespace.sockets.size;
      if (playerCount < 2) {
        socket.emit('error_message', { message: 'Need at least 2 players to start.' });
        return;
      }

      await quizService.resetGame();
      gameState.questions = quizService.pickQuestions();
      gameState.currentIndex = -1;
      gameState.gameId = `game_${Date.now()}`;
      gameState.isActive = true;

      quizNamespace.emit('game_started', {
        totalQuestions: gameState.questions.length,
        gameId: gameState.gameId,
      });

      // Start first question
      nextQuestion(quizNamespace);
    });

    // --- Submit answer ---
    socket.on('submit_answer', async (data: { questionId: string; answer: string }) => {
      if (!gameState.isActive || gameState.currentIndex < 0) {
        socket.emit('error_message', { message: 'No active question.' });
        return;
      }

      const currentQ = gameState.questions[gameState.currentIndex];

      if (data.questionId !== currentQ.id) {
        socket.emit('error_message', { message: 'Question has expired.' });
        return;
      }

      const result = await quizService.submitAnswer(
        data.questionId,
        data.answer,
        socket.id,
        currentQ.correctAnswer,
      );

      // Fire-and-forget: persist answer to PG
      const playerName = (await quizService.getPlayerName(socket.id)) ?? socket.id;
      persistence.persistAnswer(
        socket.id,
        playerName,
        data.questionId,
        data.answer,
        result.isCorrect,
        gameState.gameId,
      );

      if (result.alreadyAnswered) {
        socket.emit('answer_result', {
          questionId: data.questionId,
          isCorrect: false,
          alreadyAnswered: true,
          message: 'Someone already answered this question!',
        });
        return;
      }

      // Track this player as having answered
      gameState.answeredPlayers.add(socket.id);

      // Send result to the answerer
      socket.emit('answer_result', {
        questionId: data.questionId,
        isCorrect: result.isCorrect,
        alreadyAnswered: false,
        points: result.points,
        message: result.isCorrect ? 'Correct! 🎉' : 'Wrong answer! ❌',
      });

      // If correct — broadcast winner to everyone and move to next question
      if (result.isCorrect) {
        // Fire-and-forget: close question in PG
        persistence.closeQuestion(currentQ.question, socket.id, gameState.gameId);

        const leaderboard = await quizService.getLeaderboard();

        quizNamespace.emit('question_won', {
          questionId: data.questionId,
          winnerId: socket.id,
          correctAnswer: currentQ.correctAnswer,
          leaderboard,
        });

        quizNamespace.emit('leaderboard_update', leaderboard);

        // Clear current timer and move to next question after a delay
        clearTimer();
        setTimeout(() => nextQuestion(quizNamespace), 3000);
      } else {
        // Wrong answer — check if all connected players have answered
        const connectedCount = quizNamespace.sockets.size;
        if (gameState.answeredPlayers.size >= connectedCount) {
          // Everyone answered wrong — reveal correct answer and move on
          clearTimer();
          quizNamespace.emit('all_wrong', {
            questionId: data.questionId,
            correctAnswer: currentQ.correctAnswer,
          });
          setTimeout(() => nextQuestion(quizNamespace), 3000);
        }
      }
    });

    // --- Disconnect ---
    socket.on('disconnect', async () => {
      console.log(`Player disconnected: ${socket.id}`);
      const remaining = quizNamespace.sockets.size;
      quizNamespace.emit('player_count', { count: remaining });

      // If game is active and only 1 player left, they win
      if (gameState.isActive && remaining === 1) {
        clearTimer();
        gameState.isActive = false;

        const leaderboard = await quizService.getLeaderboard();
        quizNamespace.emit('game_over', {
          leaderboard,
          message: 'All other players left. You win!',
        });
      }
    });
  });
}

/**
 * Send the next question to all clients.
 */
function nextQuestion(namespace: ReturnType<Server['of']>): void {
  gameState.currentIndex++;

  if (gameState.currentIndex >= gameState.questions.length) {
    endGame(namespace);
    return;
  }

  const question = gameState.questions[gameState.currentIndex];

  // Reset answered tracking for new question
  gameState.answeredPlayers.clear();

  quizService.broadcastQuestion(question, gameState.gameId);

  // Fire-and-forget: persist question to PG
  persistence.persistQuestion(question, gameState.gameId);

  namespace.emit('question', {
    ...quizService.sanitiseQuestion(question),
    questionNumber: gameState.currentIndex + 1,
    totalQuestions: gameState.questions.length,
    secondsLeft: QUESTION_TIMER_SECONDS,
  });

  // Start countdown
  gameState.secondsLeft = QUESTION_TIMER_SECONDS;

  gameState.timer = setInterval(() => {
    gameState.secondsLeft--;

    namespace.emit('timer_tick', { secondsLeft: gameState.secondsLeft });

    if (gameState.secondsLeft <= 0) {
      clearTimer();
      // Time's up — reveal answer, move to next
      const currentQ = gameState.questions[gameState.currentIndex];
      namespace.emit('time_up', {
        questionId: currentQ.id,
        correctAnswer: currentQ.correctAnswer,
      });

      setTimeout(() => nextQuestion(namespace), 3000);
    }
  }, 1000);
}

/**
 * End the game and broadcast final results.
 */
async function endGame(namespace: ReturnType<Server['of']>): Promise<void> {
  clearTimer();
  gameState.isActive = false;

  const leaderboard = await quizService.getLeaderboard();

  namespace.emit('game_over', {
    leaderboard,
    message: 'Game Over! 🏆',
  });
}

/**
 * Clear the current timer interval.
 */
function clearTimer(): void {
  if (gameState.timer) {
    clearInterval(gameState.timer);
    gameState.timer = null;
  }
}
