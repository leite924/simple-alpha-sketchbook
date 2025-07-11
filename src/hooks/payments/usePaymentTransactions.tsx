
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  getUserPaymentTransactions,
  checkTransactionStatus,
  updateTransactionStatus
} from '@/integrations/pagarme/client';

export interface PaymentTransaction {
  id: string;
  user_id: string;
  pagarme_transaction_id: string;
  status: string;
  amount: number;
  method: string;
  customer_name: string;
  customer_email: string;
  card_brand?: string;
  installments?: number;
  pix_qr_code?: string;
  pix_code?: string;
  boleto_url?: string;
  created_at: string;
  updated_at: string;
}

export const usePaymentTransactions = (userId?: string) => {
  const queryClient = useQueryClient();
  const [pollingTransactions, setPollingTransactions] = useState<string[]>([]);

  // Query para buscar transações do usuário
  const {
    data: transactions,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['paymentTransactions', userId],
    queryFn: () => getUserPaymentTransactions(userId!),
    enabled: !!userId,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  // Query para buscar todas as transações (admin)
  const {
    data: allTransactions,
    isLoading: isLoadingAll,
    error: errorAll
  } = useQuery({
    queryKey: ['allPaymentTransactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !userId, // Só busca todas se não tiver userId específico
  });

  // Mutation para verificar status de transação
  const checkStatusMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      return await checkTransactionStatus(transactionId);
    },
    onSuccess: (newStatus, transactionId) => {
      toast.success(`Status atualizado: ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ['paymentTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['allPaymentTransactions'] });
    },
    onError: (error) => {
      toast.error('Erro ao verificar status da transação');
      console.error('Erro ao verificar status:', error);
    }
  });

  // Polling automático para transações pendentes
  useEffect(() => {
    if (!transactions) return;

    const pendingTransactions = transactions.filter(
      (t: PaymentTransaction) => t.status === 'pending' || t.status === 'processing'
    );

    if (pendingTransactions.length > 0) {
      const interval = setInterval(() => {
        pendingTransactions.forEach((transaction: PaymentTransaction) => {
          checkStatusMutation.mutate(transaction.pagarme_transaction_id);
        });
      }, 60000); // Verificar a cada 1 minuto

      return () => clearInterval(interval);
    }
  }, [transactions]);

  // Realtime subscription para atualizações
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('payment-transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_transactions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Transação atualizada:', payload);
          queryClient.invalidateQueries({ queryKey: ['paymentTransactions', userId] });
          
          if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new.status;
            if (newStatus === 'paid') {
              toast.success('🎉 Pagamento aprovado!');
            } else if (newStatus === 'refused') {
              toast.error('❌ Pagamento recusado');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const manualCheckStatus = async (transactionId: string) => {
    checkStatusMutation.mutate(transactionId);
  };

  const getTransactionsByStatus = (status: string) => {
    const data = transactions || allTransactions || [];
    return data.filter((t: PaymentTransaction) => t.status === status);
  };

  const getRevenueStats = () => {
    const data = transactions || allTransactions || [];
    const paidTransactions = data.filter((t: PaymentTransaction) => t.status === 'paid');
    
    return {
      totalRevenue: paidTransactions.reduce((sum: number, t: PaymentTransaction) => sum + Number(t.amount), 0),
      totalTransactions: paidTransactions.length,
      pendingRevenue: data
        .filter((t: PaymentTransaction) => t.status === 'pending')
        .reduce((sum: number, t: PaymentTransaction) => sum + Number(t.amount), 0),
      pendingTransactions: data.filter((t: PaymentTransaction) => t.status === 'pending').length
    };
  };

  return {
    transactions: transactions || allTransactions || [],
    isLoading: isLoading || isLoadingAll,
    error: error || errorAll,
    refetch,
    manualCheckStatus,
    isCheckingStatus: checkStatusMutation.isPending,
    getTransactionsByStatus,
    getRevenueStats
  };
};
