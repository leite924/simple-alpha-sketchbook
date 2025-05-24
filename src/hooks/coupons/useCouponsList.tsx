
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DiscountCoupon } from '@/types/enrollment';

// Hook for fetching all discount coupons
export const useCouponsList = () => {
  return useQuery({
    queryKey: ['discount_coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as DiscountCoupon[];
    },
  });
};
