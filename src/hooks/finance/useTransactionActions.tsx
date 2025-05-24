
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Transaction, TransactionFormValues } from '@/types/finance';

// Hook for managing transactions
export const useTransactionActions = () => {
  const queryClient = useQueryClient();
  
  // Add transaction
  const addTransaction = useMutation({
    mutationFn: async (values: TransactionFormValues) => {
      // Ensure amount is a number
      const parsedValues = {
        ...values,
        amount: typeof values.amount === 'string' 
          ? parseFloat(values.amount) 
          : values.amount
      };
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([parsedValues])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação registrada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao registrar transação: ${error.message}`);
    }
  });

  // Delete/reverse transaction
  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir transação: ${error.message}`);
    }
  });

  // Register refund
  const registerRefund = useMutation({
    mutationFn: async ({ transaction, description }: { transaction: Transaction, description: string }) => {
      const today = new Date().toISOString().split('T')[0];
      
      // Create refund transaction (with opposite value)
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          description: description || `Estorno: ${transaction.description}`,
          type: 'refund',
          amount: transaction.amount,
          transaction_date: today,
          reference_id: transaction.id,
          reference_type: 'transaction'
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Estorno registrado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao registrar estorno: ${error.message}`);
    }
  });
  
  return {
    addTransaction,
    deleteTransaction,
    registerRefund
  };
};
