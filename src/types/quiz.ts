
import { Database } from "@/integrations/supabase/types";

// Custom types for quiz functionality
export type PhotographyQuestion = {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at?: string;
  created_by?: string;
};

export type PhotographyAnswer = {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct: boolean;
  created_at?: string;
};

export type QuizScore = {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  date_played: string;
};

// Tipos para formulários e componentes
export type QuestionWithAnswers = PhotographyQuestion & {
  answers: PhotographyAnswer[];
};

export type QuizState = {
  currentQuestionIndex: number;
  questions: QuestionWithAnswers[];
  selectedAnswers: Record<string, string>;
  score: number;
  isFinished: boolean;
  loading: boolean;
};

export type QuizResult = {
  score: number;
  totalQuestions: number;
  percentage: number;
  date: Date;
};

export type QuizDifficulty = 'easy' | 'medium' | 'hard' | 'all';
export type QuizCategory = string | 'all';
