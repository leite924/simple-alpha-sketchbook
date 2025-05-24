
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DiscountCoupon } from '@/types/enrollment';

// Hook for fetching a specific discount coupon by ID
export const useCouponDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['discount_coupon', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('discount_coupons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return data as DiscountCoupon;
    },
    enabled: !!id,
  });
};
