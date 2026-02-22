'use client';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import type { Question } from '../hooks/useQuizSocket';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  correctAnswer: string | null;
  answerResult: { isCorrect: boolean; message: string } | null;
  winnerName: string | null;
  disabled: boolean;
  onSubmitAnswer: (answer: string) => void;
}

export function QuestionCard({
  question,
  selectedAnswer,
  correctAnswer,
  answerResult,
  winnerName,
  disabled,
  onSubmitAnswer,
}: QuestionCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <span className="w-fit rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary capitalize">
          {question.difficulty}
        </span>
        <CardTitle className="text-2xl leading-relaxed mt-2">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {question.options.map((option) => {
            let variant: 'outline' | 'default' | 'destructive' | 'secondary' = 'outline';
            let extraClass = 'h-14 text-lg justify-start px-6 hover:bg-accent transition-all';

            if (correctAnswer) {
              if (option === correctAnswer) {
                variant = 'default';
                extraClass += ' bg-emerald-600 hover:bg-emerald-600 text-white border-emerald-600';
              } else if (option === selectedAnswer && option !== correctAnswer) {
                variant = 'destructive';
              }
            } else if (selectedAnswer === option) {
              variant = 'secondary';
              extraClass += ' ring-2 ring-primary';
            }

            return (
              <Button
                key={option}
                variant={variant}
                className={extraClass}
                onClick={() => onSubmitAnswer(option)}
                disabled={disabled || !!selectedAnswer}
              >
                {option}
              </Button>
            );
          })}
        </div>

        {/* Answer feedback */}
        {answerResult && (
          <div
            className={`rounded-lg p-3 text-center font-semibold ${
              answerResult.isCorrect
                ? 'bg-primary/10 text-primary'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {answerResult.isCorrect ? 'Correct!' : 'Wrong answer'}
          </div>
        )}

        {/* Winner announcement */}
        {correctAnswer && winnerName && (
          <div className="rounded-lg bg-primary/10 p-3 text-center text-primary font-medium">
            {winnerName} answered first
          </div>
        )}

        {/* No winner (time up or all wrong) */}
        {correctAnswer && !winnerName && (
          <div className="rounded-lg bg-muted p-3 text-center text-muted-foreground font-medium">
            Correct answer: {correctAnswer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
