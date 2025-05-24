
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QuizScore } from '@/types/quiz';

// Hook for saving quiz scores
export const useSaveQuizScore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ score, totalQuestions }: { score: number, totalQuestions: number }) => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        toast.error('You need to be logged in to save your score');
        throw new Error('User not authenticated');
      }
      
      const userId = session.session.user.id;
      
      const { data, error } = await supabase
        .from('quiz_scores')
        .insert([{
          user_id: userId,
          score,
          total_questions: totalQuestions,
        }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizScores'] });
      toast.success('Score saved successfully!');
    },
    onError: (error: Error) => {
      if (error.message !== 'User not authenticated') {
        toast.error(`Error saving score: ${error.message}`);
      }
    }
  });
};

// Hook for fetching user's quiz scores history
export const useQuizScores = () => {
  const fetchScores = async (): Promise<QuizScore[]> => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        return [];
      }
      
      const userId = session.session.user.id;
      
      const { data, error } = await supabase
        .from('quiz_scores')
        .select()
        .eq('user_id', userId)
        .order('date_played', { ascending: false });
      
      if (error) {
        console.error('Error fetching scores:', error);
        toast.error('Error loading score history');
        throw error;
      }
      
      return data as QuizScore[] || [];
    } catch (error) {
      console.error('Error fetching quiz scores:', error);
      throw error;
    }
  };
  
  return useQuery({
    queryKey: ['quizScores'],
    queryFn: fetchScores,
  });
};
