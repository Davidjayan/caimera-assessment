'use client';

import { useQuizSocket } from './features/quiz/hooks/useQuizSocket';
import {
  LobbyScreen,
  TimerBar,
  QuestionCard,
  Leaderboard,
  WaitingScreen,
  GameOverScreen,
} from './features/quiz/components';

export default function QuizPage() {
  const quiz = useQuizSocket();

  // --- Lobby ---
  if (quiz.phase === 'lobby' && !quiz.hasJoined) {
    return (
      <LobbyScreen
        playerName={quiz.playerName}
        onPlayerNameChange={quiz.setPlayerName}
        onJoin={quiz.joinGame}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-primary/40 px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold">Maths Quiz</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{quiz.playerName}</span>
            <span
              className={`h-2.5 w-2.5 rounded-full ${quiz.connected ? 'bg-primary' : 'bg-destructive'}`}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-1 gap-6 p-4 w-full">
        {/* Left: Main content */}
        <div className="flex-1 space-y-4">
          {/* Timer */}
          {quiz.phase === 'playing' && quiz.question && (
            <TimerBar
              secondsLeft={quiz.secondsLeft}
              questionNumber={quiz.question.questionNumber}
              totalQuestions={quiz.question.totalQuestions}
            />
          )}

          {/* Question */}
          {quiz.question && (quiz.phase === 'playing' || quiz.phase === 'result') && (
            <QuestionCard
              question={quiz.question}
              selectedAnswer={quiz.selectedAnswer}
              correctAnswer={quiz.correctAnswer}
              answerResult={quiz.answerResult}
              winnerName={quiz.winnerName}
              disabled={quiz.phase === 'result'}
              onSubmitAnswer={quiz.submitAnswer}
            />
          )}

          {/* Waiting for game to start */}
          {quiz.phase === 'waiting' && (
            <WaitingScreen
              playerCount={quiz.playerCount}
              errorMessage={quiz.errorMessage}
              isGenerating={quiz.isGenerating}
              onStartGame={quiz.startGame}
            />
          )}

          {/* Game over */}
          {quiz.phase === 'game_over' && (
            <GameOverScreen
              leaderboard={quiz.leaderboard}
              message={quiz.gameOverMessage}
              onPlayAgain={quiz.startGame}
            />
          )}
        </div>

        {/* Right: Leaderboard */}
        <div className="w-72 shrink-0 hidden md:block">
          <Leaderboard leaderboard={quiz.leaderboard} currentPlayerId={quiz.playerId} />
        </div>
      </main>
    </div>
  );
}
