
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FinancialCategory } from '@/types/finance';

// Hook for fetching financial categories
export const useCategories = () => {
  const fetchCategories = async (): Promise<FinancialCategory[]> => {
    const { data, error } = await supabase
      .from('financial_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar categorias:', error);
      toast.error('Erro ao carregar categorias financeiras');
      throw error;
    }
    
    return data || [];
  };
  
  return useQuery({
    queryKey: ['financialCategories'],
    queryFn: fetchCategories,
  });
};
