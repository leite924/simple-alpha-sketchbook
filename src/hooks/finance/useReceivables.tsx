
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Receivable } from '@/types/finance';

// Hook for fetching receivables
export const useReceivables = () => {
  const fetchReceivables = async (): Promise<Receivable[]> => {
    const { data, error } = await supabase
      .from('receivables')
      .select('*, financial_categories(name, type)')
      .order('due_date');
    
    if (error) {
      console.error('Erro ao buscar contas a receber:', error);
      toast.error('Erro ao carregar contas a receber');
      throw error;
    }
    
    return data || [];
  };
  
  return useQuery({
    queryKey: ['receivables'],
    queryFn: fetchReceivables,
  });
};
