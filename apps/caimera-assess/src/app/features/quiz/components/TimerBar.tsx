'use client';

interface TimerBarProps {
  secondsLeft: number;
  totalSeconds?: number;
  questionNumber: number;
  totalQuestions: number;
}

export function TimerBar({
  secondsLeft,
  totalSeconds = 60,
  questionNumber,
  totalQuestions,
}: TimerBarProps) {
  const percent = (secondsLeft / totalSeconds) * 100;
  const color =
    secondsLeft > 30
      ? 'bg-emerald-500'
      : secondsLeft > 10
        ? 'bg-amber-500'
        : 'bg-red-500';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-medium">
        <span>
          Question {questionNumber}/{totalQuestions}
        </span>
        <span className={secondsLeft <= 10 ? 'text-red-500 animate-pulse font-bold' : ''}>
          {secondsLeft}s
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
