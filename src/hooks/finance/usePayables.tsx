
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Payable } from '@/types/finance';

// Hook for fetching payables
export const usePayables = () => {
  const fetchPayables = async (): Promise<Payable[]> => {
    const { data, error } = await supabase
      .from('payables')
      .select('*, financial_categories(name, type)')
      .order('due_date');
    
    if (error) {
      console.error('Erro ao buscar contas a pagar:', error);
      toast.error('Erro ao carregar contas a pagar');
      throw error;
    }
    
    return data || [];
  };
  
  return useQuery({
    queryKey: ['payables'],
    queryFn: fetchPayables,
  });
};
