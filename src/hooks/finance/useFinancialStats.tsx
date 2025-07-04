import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FinancialStats } from '@/types/finance';

// Hook for fetching financial statistics - placeholder since the tables don't exist yet
export const useFinancialStats = () => {
  const fetchStats = async (): Promise<FinancialStats> => {
    try {
      console.log('Financial stats functionality not yet implemented');
      
      // Return placeholder stats
      return {
        totalReceivables: 0,
        totalPayables: 0,
        currentBalance: 0,
        pendingReceivables: 0,
        pendingPayables: 0
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