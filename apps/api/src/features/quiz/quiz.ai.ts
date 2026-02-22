import { generateText, Output } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';
import { QUESTIONS, type QuizQuestion } from './quiz.constants';

// Define the schema representing the expected AI output format
const QuestionSchema = z.object({
    questions: z.array(
        z.object({
            id: z.string(),
            question: z.string(),
            options: z.array(z.string()).length(4),
            correctAnswer: z.string(),
            difficulty: z.enum(['easy', 'medium', 'hard']),
        })
    ),
});

export async function generateQuestions(count: number): Promise<QuizQuestion[]> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is not set');
    }

    const openrouter = createOpenRouter({
        apiKey,
    });

    try {
        // Use Vercel AI SDK's generateObject for structured JSON output
        const { output } = await generateText({
            model: openrouter('google/gemma-3-27b-it:free'), // Example fallback, can adjust model name
            output: Output.object({ schema: QuestionSchema }),
            system: `You are an expert maths teacher. Generate exactly ${count} maths questions covering various topics (algebra, calculus, probability...). Ensure the output exactly matches the requested JSON schema.`,
            prompt: `Generate ${count} math questions now.`,
            maxRetries: 3
        });

        return output.questions as QuizQuestion[];
    } catch (error) {
        console.error('Error generating AI questions, falling back to constant questions:', error);
        // Shuffle and take 'count' elements from constant questions
        const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
}
