
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Transaction } from '@/types/finance';

// Hook for fetching transactions
export const useTransactions = () => {
  const fetchTransactions = async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar transações:', error);
      toast.error('Erro ao carregar transações');
      throw error;
    }
    
    return data || [];
  };
  
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });
};
