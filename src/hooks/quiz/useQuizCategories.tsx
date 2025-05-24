
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Hook for fetching all quiz categories
export const useQuizCategories = () => {
  const fetchCategories = async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('photography_questions')
        .select('category');
      
      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error loading quiz categories');
        throw error;
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Extract and remove duplicates
      const categories = [...new Set(data.map(item => item.category))];
      return categories;
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
