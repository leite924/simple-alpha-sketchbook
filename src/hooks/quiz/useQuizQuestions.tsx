
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  PhotographyQuestion, 
  PhotographyAnswer, 
  QuestionWithAnswers,
  QuizDifficulty,
  QuizCategory
} from '@/types/quiz';

// Hook for fetching quiz questions with their answers
export const useQuizQuestions = (
  difficulty: QuizDifficulty = 'all',
  category: QuizCategory = 'all',
  limit: number = 10
) => {
  const fetchQuestions = async (): Promise<QuestionWithAnswers[]> => {
    try {
      // First fetch the questions according to filters
      let query = supabase.from('photography_questions').select();
      
      // Apply filters if not 'all'
      if (difficulty !== 'all') {
        query = query.eq('difficulty', difficulty);
      }
      
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      
      // Execute query and capture results
      const { data: questions, error: questionsError } = await query
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        toast.error('Error loading quiz questions');
        throw questionsError;
      }
      
      if (!questions || questions.length === 0) {
        return [];
      }
      
      // For each question, fetch its answers
      const questionsWithAnswers: QuestionWithAnswers[] = [];
      
      for (const question of questions) {
        const { data: answers, error: answersError } = await supabase
          .from('photography_answers')
          .select()
          .eq('question_id', question.id);
        
        if (answersError) {
          console.error('Error fetching answers:', answersError);
          toast.error('Error loading question answers');
          throw answersError;
        }
        
        questionsWithAnswers.push({
          ...question as PhotographyQuestion,
          answers: answers as PhotographyAnswer[] || []
        });
      }
      
      return questionsWithAnswers;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  };
  
  return useQuery({
    queryKey: ['quizQuestions', difficulty, category, limit],
    queryFn: fetchQuestions,
  });
};
