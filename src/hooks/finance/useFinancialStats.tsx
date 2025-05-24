
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FinancialStats } from '@/types/finance';

// Hook for fetching financial statistics
export const useFinancialStats = () => {
  const fetchStats = async (): Promise<FinancialStats> => {
    try {
      // Get total receivables
      const { data: receivables, error: receivablesError } = await supabase
        .from('receivables')
        .select('amount, status');
      
      if (receivablesError) throw receivablesError;
      
      // Get total payables
      const { data: payables, error: payablesError } = await supabase
        .from('payables')
        .select('amount, status');
      
      if (payablesError) throw payablesError;

      // Calculate statistics
      const totalReceivables = receivables?.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0) || 0;
      const totalPayables = payables?.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0) || 0;
      const currentBalance = totalReceivables - totalPayables;
      
      const pendingReceivables = receivables
        ?.filter(item => item.status === 'pending')
        .reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0) || 0;
      
      const pendingPayables = payables
        ?.filter(item => item.status === 'pending')
        .reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0) || 0;

      return {
        totalReceivables,
        totalPayables,
        currentBalance,
        pendingReceivables,
        pendingPayables
      };
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas financeiras:', error);
      toast.error('Erro ao carregar estatísticas financeiras');
      throw error;
    }
  };
  
  return useQuery({
    queryKey: ['financialStats'],
    queryFn: fetchStats,
  });
};
