'use client';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import type { LeaderboardEntry } from '../hooks/useQuizSocket';

interface GameOverScreenProps {
  leaderboard: LeaderboardEntry[];
  message?: string | null;
  onPlayAgain: () => void;
}

export function GameOverScreen({ leaderboard, message, onPlayAgain }: GameOverScreenProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
        <h2 className="text-3xl font-bold">{message || 'Game Over'}</h2>
        {leaderboard[0] && (
          <p className="text-xl text-muted-foreground">
            Winner:{' '}
            <span className="font-bold text-primary">{leaderboard[0].playerName}</span>{' '}
            with {leaderboard[0].score} points
          </p>
        )}
        <Button onClick={onPlayAgain} size="lg" className="text-lg font-semibold">
          Play Again
        </Button>
      </CardContent>
    </Card>
  );
}
