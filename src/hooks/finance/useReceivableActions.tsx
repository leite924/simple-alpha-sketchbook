
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReceivableFormValues } from '@/types/finance';

// Hook for managing receivables
export const useReceivableActions = () => {
  const queryClient = useQueryClient();

  // Add receivable
  const addReceivable = useMutation({
    mutationFn: async (values: ReceivableFormValues) => {
      // Ensure amount is a number
      const parsedValues = {
        ...values,
        amount: typeof values.amount === 'string' 
          ? parseFloat(values.amount) 
          : values.amount,
        payer: values.customer // Map customer to payer for database
      };
      
      const { data, error } = await supabase
        .from('receivables')
        .insert([parsedValues])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivables'] });
      toast.success('Conta a receber adicionada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar conta a receber: ${error.message}`);
    }
  });

  // Update receivable status
  const updateReceivableStatus = useMutation({
    mutationFn: async ({ id, status, paymentDate }: { id: string, status: string, paymentDate?: string }) => {
      const updateData: Record<string, any> = { status };
      if (paymentDate) {
        updateData.payment_date = paymentDate;
      }
      
      const { data, error } = await supabase
        .from('receivables')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivables'] });
      toast.success('Status da conta a receber atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar status: ${error.message}`);
    }
  });

  // Delete receivable
  const deleteReceivable = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('receivables')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivables'] });
      toast.success('Conta a receber excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir conta a receber: ${error.message}`);
    }
  });
  
  return {
    addReceivable,
    updateReceivableStatus,
    deleteReceivable
  };
};
