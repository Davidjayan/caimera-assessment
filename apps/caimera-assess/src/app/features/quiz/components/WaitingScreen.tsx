'use client';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';

interface WaitingScreenProps {
  playerCount: number;
  errorMessage: string | null;
  isGenerating: boolean;
  onStartGame: () => void;
}

export function WaitingScreen({
  playerCount,
  errorMessage,
  isGenerating,
  onStartGame,
}: WaitingScreenProps) {
  const canStart = playerCount >= 2 && !isGenerating;

  return (
    <Card className="shadow-lg">
      <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
        <p className="text-xl font-medium text-muted-foreground">
          Waiting for players...
        </p>
        <p className="text-sm text-muted-foreground">
          {playerCount} player{playerCount !== 1 ? 's' : ''} connected
        </p>
        {!canStart && !isGenerating && (
          <p className="text-sm text-muted-foreground">
            Need at least 2 players to start
          </p>
        )}
        {isGenerating && (
          <div className="flex flex-col items-center space-y-2 mt-4 text-primary">
            <svg
              className="animate-spin h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-sm font-semibold animate-pulse">Generating AI questions...</p>
          </div>
        )}
        {errorMessage && (
          <p className="text-sm text-destructive font-medium">{errorMessage}</p>
        )}
        <Button
          onClick={onStartGame}
          size="lg"
          className="text-lg font-semibold mt-4"
          disabled={!canStart}
        >
          {isGenerating ? 'Please wait...' : 'Start Game'}
        </Button>
      </CardContent>
    </Card>
  );
}
