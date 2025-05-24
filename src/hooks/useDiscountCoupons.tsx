
import { useCouponsList } from './coupons/useCouponsList';
import { useCouponDetail } from './coupons/useCouponDetail';
import { useCouponActions } from './coupons/useCouponActions';
import { useVerifyCoupon } from './coupons/useVerifyCoupon';

// Re-exports for backward compatibility
export const useDiscountCoupons = useCouponsList;
export const useDiscountCouponDetail = useCouponDetail;
export const useDiscountCouponActions = () => {
  const { addCoupon, updateCoupon, deleteCoupon } = useCouponActions();
  const verifyCoupon = useVerifyCoupon();
  
  return {
    addCoupon,
    updateCoupon,
    deleteCoupon,
    verifyCoupon
  };
};
