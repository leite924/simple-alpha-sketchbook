
import { supabase } from '@/integrations/supabase/client';

export async function validateCoupon(couponCode: string): Promise<{
  couponId: string | null;
  discountAmount: number;
} | undefined> {
  try {
    if (!couponCode) {
      return { couponId: null, discountAmount: 0 };
    }
    
    const { data: coupon, error } = await supabase
      .from('discount_coupons')
      .select('*')
      .eq('code', couponCode)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching coupon:', error);
      return { couponId: null, discountAmount: 0 };
    } 
    
    if (coupon) {
      return {
        couponId: coupon.id,
        discountAmount: 0 // In a real app, calculate this based on coupon details
      };
    }
    
    return { couponId: null, discountAmount: 0 };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { couponId: null, discountAmount: 0 };
  }
}
