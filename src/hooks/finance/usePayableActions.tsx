
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PayableFormValues } from '@/types/finance';

// Hook for managing payables
export const usePayableActions = () => {
  const queryClient = useQueryClient();

  // Add payable
  const addPayable = useMutation({
    mutationFn: async (values: PayableFormValues) => {
      // Ensure amount is a number
      const parsedValues = {
        ...values,
        amount: typeof values.amount === 'string' 
          ? parseFloat(values.amount) 
          : values.amount,
        recipient: values.supplier // Map supplier to recipient for database
      };
      
      const { data, error } = await supabase
        .from('payables')
        .insert([parsedValues])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      toast.success('Conta a pagar adicionada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar conta a pagar: ${error.message}`);
    }
  });

  // Update payable status
  const updatePayableStatus = useMutation({
    mutationFn: async ({ id, status, paymentDate }: { id: string, status: string, paymentDate?: string }) => {
      const updateData: Record<string, any> = { status };
      if (paymentDate) {
        updateData.payment_date = paymentDate;
      }
      
      const { data, error } = await supabase
        .from('payables')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      toast.success('Status da conta a pagar atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar status: ${error.message}`);
    }
  });

  // Delete payable
  const deletePayable = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('payables')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      toast.success('Conta a pagar excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir conta a pagar: ${error.message}`);
    }
  });
  
  return {
    addPayable,
    updatePayableStatus,
    deletePayable
  };
};
