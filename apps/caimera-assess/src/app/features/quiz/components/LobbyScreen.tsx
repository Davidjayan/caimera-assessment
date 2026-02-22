'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

interface LobbyScreenProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onJoin: () => void;
}

export function LobbyScreen({ playerName, onPlayerNameChange, onJoin }: LobbyScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Maths Quiz</CardTitle>
          <p className="text-sm text-muted-foreground">
            Multiplayer real-time maths challenge
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => onPlayerNameChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onJoin()}
            className="h-12 text-lg"
            autoFocus
          />
          <Button
            onClick={onJoin}
            className="h-12 w-full text-lg font-semibold"
            disabled={!playerName.trim()}
          >
            Join Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
