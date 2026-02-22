'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import type { LeaderboardEntry } from '../hooks/useQuizSocket';

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentPlayerId: string;
}

export function Leaderboard({ leaderboard, currentPlayerId }: LeaderboardProps) {
  return (
    <Card className="sticky top-4 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <p className="text-sm text-muted-foreground">No scores yet</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.playerId}
                className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                  entry.playerId === currentPlayerId
                    ? 'bg-primary/10 ring-1 ring-primary/30'
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 text-sm font-bold text-muted-foreground text-right">
                    {index + 1}.
                  </span>
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {entry.playerName}
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">{entry.score}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
