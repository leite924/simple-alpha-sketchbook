
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DiscountCoupon } from '@/types/enrollment';

// Hook for verifying coupon validity
export const useVerifyCoupon = () => {
  return useMutation({
    mutationFn: async ({ code, courseId, amount }: { code: string, courseId?: string, amount?: number }) => {
      const { data, error } = await supabase
        .from('discount_coupons')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .lte('valid_from', new Date().toISOString())
        .or(`valid_until.is.null,valid_until.gte.${new Date().toISOString()}`)
        .single();

      if (error) throw new Error('Cupom inválido ou expirado');
      
      const coupon = data as DiscountCoupon;
      
      // Check if the coupon has reached its usage limit
      if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
        throw new Error('Este cupom já atingiu o limite de usos');
      }
      
      // Check if the coupon is for a specific course
      if (coupon.course_id && courseId && coupon.course_id !== courseId) {
        throw new Error('Este cupom não é válido para este curso');
      }
      
      // Check if the purchase meets the minimum amount
      if (coupon.minimum_purchase && amount && amount < coupon.minimum_purchase) {
        throw new Error(`O valor mínimo para este cupom é de R$ ${coupon.minimum_purchase.toFixed(2)}`);
      }
      
      return coupon;
    },
    onError: (error) => {
      toast.error(`Erro ao verificar cupom: ${error.message}`);
    }
  });
};
