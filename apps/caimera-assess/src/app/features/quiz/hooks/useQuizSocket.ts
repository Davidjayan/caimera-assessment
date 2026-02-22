'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSocket } from '../lib/socket';

export interface Question {
  id: string;
  question: string;
  options: string[];
  difficulty: string;
  questionNumber: number;
  totalQuestions: number;
  secondsLeft: number;
}

export interface LeaderboardEntry {
  playerId: string;
  score: number;
  playerName: string;
}

export type GamePhase = 'lobby' | 'waiting' | 'playing' | 'result' | 'game_over';

export function useQuizSocket() {
  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [connected, setConnected] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasJoined = useRef(false);

  // --- Socket event listeners ---
  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('joined', (data) => {
      setPlayerId(data.playerId);
      setPhase('waiting');
    });

    socket.on('player_count', (data) => {
      setPlayerCount(data.count);
    });

    socket.on('game_started', () => {
      setPhase('waiting');
      setCorrectAnswer(null);
      setAnswerResult(null);
      setSelectedAnswer(null);
      setErrorMessage(null);
      setGameOverMessage(null);
    });

    socket.on('question', (data: Question) => {
      setQuestion(data);
      setSecondsLeft(data.secondsLeft);
      setSelectedAnswer(null);
      setAnswerResult(null);
      setCorrectAnswer(null);
      setWinnerName(null);
      setPhase('playing');
    });

    socket.on('timer_tick', (data) => {
      setSecondsLeft(data.secondsLeft);
    });

    socket.on('answer_result', (data) => {
      setAnswerResult({ isCorrect: data.isCorrect, message: data.message });
    });

    socket.on('question_won', (data) => {
      setCorrectAnswer(data.correctAnswer);
      const winner = data.leaderboard.find(
        (e: LeaderboardEntry) => e.playerId === data.winnerId,
      );
      setWinnerName(winner?.playerName ?? 'Someone');
      setPhase('result');
    });

    socket.on('time_up', (data) => {
      setCorrectAnswer(data.correctAnswer);
      setWinnerName(null);
      setPhase('result');
    });

    socket.on('all_wrong', (data) => {
      setCorrectAnswer(data.correctAnswer);
      setWinnerName(null);
      setPhase('result');
    });

    socket.on('leaderboard_update', (data: LeaderboardEntry[]) => {
      setLeaderboard(data);
    });

    socket.on('game_over', (data) => {
      setLeaderboard(data.leaderboard);
      setGameOverMessage(data.message || 'Game Over!');
      setPhase('game_over');
    });

    socket.on('error_message', (data) => {
      setErrorMessage(data.message);
      setTimeout(() => setErrorMessage(null), 4000);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  // --- Actions ---
  const joinGame = useCallback(() => {
    if (!playerName.trim()) return;
    const socket = getSocket();
    if (!socket.connected) socket.connect();
    socket.emit('join_game', { playerName: playerName.trim() });
    hasJoined.current = true;
  }, [playerName]);

  const startGame = useCallback(() => {
    getSocket().emit('start_game');
  }, []);

  const submitAnswer = useCallback(
    (answer: string) => {
      if (selectedAnswer || !question) return;
      setSelectedAnswer(answer);
      getSocket().emit('submit_answer', { questionId: question.id, answer });
    },
    [selectedAnswer, question],
  );

  return {
    phase,
    playerName,
    setPlayerName,
    playerId,
    connected,
    question,
    secondsLeft,
    selectedAnswer,
    answerResult,
    correctAnswer,
    leaderboard,
    winnerName,
    gameOverMessage,
    playerCount,
    errorMessage,
    hasJoined: hasJoined.current,
    joinGame,
    startGame,
    submitAnswer,
  };
}
