export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QUESTION_TIMER_SECONDS = 60;
export const POINTS_PER_CORRECT = 10;
export const MAX_QUESTIONS_PER_GAME = 10;

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is 15 × 12?',
    options: ['170', '180', '190', '200'],
    correctAnswer: '180',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    question: 'What is the square root of 144?',
    options: ['10', '11', '12', '14'],
    correctAnswer: '12',
    difficulty: 'easy',
  },
  {
    id: 'q3',
    question: 'What is 256 ÷ 16?',
    options: ['14', '15', '16', '17'],
    correctAnswer: '16',
    difficulty: 'easy',
  },
  {
    id: 'q4',
    question: 'What is 7³?',
    options: ['243', '343', '441', '512'],
    correctAnswer: '343',
    difficulty: 'medium',
  },
  {
    id: 'q5',
    question: 'What is 45% of 200?',
    options: ['80', '85', '90', '95'],
    correctAnswer: '90',
    difficulty: 'easy',
  },
  {
    id: 'q6',
    question: 'Solve: 3x + 7 = 22. What is x?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5',
    difficulty: 'medium',
  },
  {
    id: 'q7',
    question: 'What is the LCM of 12 and 18?',
    options: ['24', '36', '48', '72'],
    correctAnswer: '36',
    difficulty: 'medium',
  },
  {
    id: 'q8',
    question: 'What is 17 × 23?',
    options: ['371', '381', '391', '401'],
    correctAnswer: '391',
    difficulty: 'medium',
  },
  {
    id: 'q9',
    question: 'What is the GCD of 48 and 64?',
    options: ['8', '12', '16', '24'],
    correctAnswer: '16',
    difficulty: 'medium',
  },
  {
    id: 'q10',
    question: 'What is 2⁸?',
    options: ['128', '256', '512', '1024'],
    correctAnswer: '256',
    difficulty: 'easy',
  },
  {
    id: 'q11',
    question: 'If a triangle has sides 3, 4, and 5, what is its area?',
    options: ['5', '6', '7', '8'],
    correctAnswer: '6',
    difficulty: 'medium',
  },
  {
    id: 'q12',
    question: 'What is 999 + 1001?',
    options: ['1998', '1999', '2000', '2001'],
    correctAnswer: '2000',
    difficulty: 'easy',
  },
  {
    id: 'q13',
    question: 'What is the value of π rounded to 2 decimal places?',
    options: ['3.12', '3.14', '3.16', '3.18'],
    correctAnswer: '3.14',
    difficulty: 'easy',
  },
  {
    id: 'q14',
    question: 'Solve: 5! (5 factorial)',
    options: ['60', '100', '120', '150'],
    correctAnswer: '120',
    difficulty: 'medium',
  },
  {
    id: 'q15',
    question: 'What is the sum of interior angles of a hexagon?',
    options: ['540°', '620°', '720°', '900°'],
    correctAnswer: '720°',
    difficulty: 'hard',
  },
  {
    id: 'q16',
    question: 'What is 1/3 + 1/4?',
    options: ['2/7', '7/12', '1/2', '5/12'],
    correctAnswer: '7/12',
    difficulty: 'medium',
  },
  {
    id: 'q17',
    question: 'What is the cube root of 729?',
    options: ['7', '8', '9', '10'],
    correctAnswer: '9',
    difficulty: 'medium',
  },
  {
    id: 'q18',
    question: 'How many prime numbers are between 1 and 20?',
    options: ['6', '7', '8', '9'],
    correctAnswer: '8',
    difficulty: 'hard',
  },
  {
    id: 'q19',
    question: 'What is 0.125 as a fraction?',
    options: ['1/4', '1/6', '1/8', '1/10'],
    correctAnswer: '1/8',
    difficulty: 'medium',
  },
  {
    id: 'q20',
    question: 'What is the next number: 2, 6, 12, 20, ?',
    options: ['28', '30', '32', '36'],
    correctAnswer: '30',
    difficulty: 'hard',
  },
];
