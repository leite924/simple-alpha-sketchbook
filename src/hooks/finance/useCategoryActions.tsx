
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FinancialCategory, CategoryFormValues } from '@/types/finance';

// Hook for managing categories
export const useCategoryActions = () => {
  const queryClient = useQueryClient();
  
  // Add category
  const addCategory = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const { data, error } = await supabase
        .from('financial_categories')
        .insert([values])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialCategories'] });
      toast.success('Categoria adicionada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar categoria: ${error.message}`);
    }
  });

  // Update category
  const updateCategory = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: Partial<FinancialCategory> }) => {
      const { data, error } = await supabase
        .from('financial_categories')
        .update(values)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialCategories'] });
      toast.success('Categoria atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar categoria: ${error.message}`);
    }
  });

  // Delete category
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('financial_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialCategories'] });
      toast.success('Categoria excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir categoria: ${error.message}`);
    }
  });
  
  return {
    addCategory,
    updateCategory,
    deleteCategory
  };
};
