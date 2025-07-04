
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Hook for fetching all quiz categories - placeholder since the table doesn't exist yet
export const useQuizCategories = () => {
  const fetchCategories = async (): Promise<string[]> => {
    try {
      console.log('Quiz categories functionality not yet implemented');
      return ['Básico', 'Intermediário', 'Avançado'];
    } catch (error) {
      console.error('Error fetching quiz categories:', error);
      throw error;
    }
  };
  
  return useQuery({
    queryKey: ['quizCategories'],
    queryFn: fetchCategories,
  });
};
