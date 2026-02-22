'use client';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';

interface WaitingScreenProps {
  playerCount: number;
  errorMessage: string | null;
  onStartGame: () => void;
}

export function WaitingScreen({ playerCount, errorMessage, onStartGame }: WaitingScreenProps) {
  const canStart = playerCount >= 2;

  return (
    <Card className="shadow-lg">
      <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
        <p className="text-xl font-medium text-muted-foreground">
          Waiting for players...
        </p>
        <p className="text-sm text-muted-foreground">
          {playerCount} player{playerCount !== 1 ? 's' : ''} connected
        </p>
        {!canStart && (
          <p className="text-sm text-muted-foreground">
            Need at least 2 players to start
          </p>
        )}
        {errorMessage && (
          <p className="text-sm text-destructive font-medium">{errorMessage}</p>
        )}
        <Button
          onClick={onStartGame}
          size="lg"
          className="text-lg font-semibold"
          disabled={!canStart}
        >
          Start Game
        </Button>
      </CardContent>
    </Card>
  );
}
