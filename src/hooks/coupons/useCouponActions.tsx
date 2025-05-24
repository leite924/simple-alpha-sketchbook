
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DiscountCouponFormValues } from '@/types/enrollment';

// Hook for managing coupon operations (add, update, delete)
export const useCouponActions = () => {
  const queryClient = useQueryClient();

  // Add coupon
  const addCoupon = useMutation({
    mutationFn: async (values: DiscountCouponFormValues) => {
      try {
        console.log("Original values:", values);
        
        // Ensure numeric values are properly parsed
        const parsedValues = {
          code: values.code,
          description: values.description || null,
          discount_type: values.discount_type,
          // Ensure discount_value is always a number
          discount_value: typeof values.discount_value === 'string' && values.discount_value !== '' 
            ? parseFloat(values.discount_value) 
            : (typeof values.discount_value === 'number' ? values.discount_value : 0),
          // Handle max_uses
          max_uses: values.max_uses !== undefined && values.max_uses !== '' 
            ? (typeof values.max_uses === 'string' 
                ? parseInt(values.max_uses) 
                : values.max_uses)
            : null,
          valid_from: values.valid_from,
          valid_until: values.valid_until || null,
          is_active: values.is_active ?? true,
          // Explicitly set course_id to null if empty or undefined
          course_id: values.course_id === null || values.course_id === undefined || values.course_id === '' 
            ? null 
            : values.course_id,
          // Handle minimum_purchase
          minimum_purchase: values.minimum_purchase !== undefined && values.minimum_purchase !== '' 
            ? (typeof values.minimum_purchase === 'string'
                ? parseFloat(values.minimum_purchase) 
                : values.minimum_purchase)
            : null
        };

        console.log("Sending coupon data to server:", parsedValues);

        // Create the coupon
        const { data, error } = await supabase
          .from('discount_coupons')
          .insert(parsedValues)
          .select()
          .single();

        if (error) {
          console.error("Database error:", error);
          throw new Error(error.message || "Erro ao criar cupom de desconto");
        }
        
        console.log("Coupon created successfully:", data);
        return data;
      } catch (err: any) {
        console.error("Exception during coupon creation:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log("Coupon creation success:", data);
      queryClient.invalidateQueries({ queryKey: ['discount_coupons'] });
      toast.success('Cupom de desconto criado com sucesso!');
    },
    onError: (error: Error) => {
      console.error("Error creating coupon:", error);
      toast.error(`Erro ao criar cupom: ${error.message}`);
    }
  });

  // Update coupon
  const updateCoupon = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: Partial<DiscountCouponFormValues> }) => {
      try {
        // Parse numeric values
        const parsedValues: any = { ...values };
        
        if (values.discount_value !== undefined) {
          parsedValues.discount_value = typeof values.discount_value === 'string' && values.discount_value !== ''
            ? parseFloat(values.discount_value) 
            : (typeof values.discount_value === 'number' ? values.discount_value : 0);
        }
        
        if (values.max_uses !== undefined) {
          parsedValues.max_uses = typeof values.max_uses === 'string' && values.max_uses !== ''
            ? parseInt(values.max_uses) 
            : values.max_uses;
          
          if (parsedValues.max_uses === '') {
            parsedValues.max_uses = null;
          }
        }
        
        if (values.minimum_purchase !== undefined) {
          parsedValues.minimum_purchase = typeof values.minimum_purchase === 'string' && values.minimum_purchase !== ''
            ? parseFloat(values.minimum_purchase) 
            : values.minimum_purchase;
            
          if (parsedValues.minimum_purchase === '') {
            parsedValues.minimum_purchase = null;
          }
        }

        // Ensure course_id is handled properly
        if (values.course_id === null || values.course_id === undefined || values.course_id === '') {
          parsedValues.course_id = null;
        }

        console.log("Updating coupon with values:", parsedValues);

        const { data, error } = await supabase
          .from('discount_coupons')
          .update(parsedValues)
          .eq('id', id)
          .select()
          .single();

        if (error) throw new Error(error.message);
        return data;
      } catch (err: any) {
        console.error("Exception during coupon update:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount_coupons'] });
      toast.success('Cupom de desconto atualizado com sucesso!');
    },
    onError: (error: Error) => {
      console.error("Error updating coupon:", error);
      toast.error(`Erro ao atualizar cupom: ${error.message}`);
    }
  });

  // Delete coupon
  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('discount_coupons')
          .delete()
          .eq('id', id);

        if (error) throw new Error(error.message);
        return { id };
      } catch (err: any) {
        console.error("Exception during coupon deletion:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount_coupons'] });
      toast.success('Cupom de desconto excluído com sucesso!');
    },
    onError: (error: Error) => {
      console.error("Error deleting coupon:", error);
      toast.error(`Erro ao excluir cupom: ${error.message}`);
    }
  });

  return {
    addCoupon,
    updateCoupon,
    deleteCoupon
  };
};
