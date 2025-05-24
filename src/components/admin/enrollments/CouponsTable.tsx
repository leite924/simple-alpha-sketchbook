
import React, { useState } from 'react';
import { DiscountCoupon } from '@/types/enrollment';
import { useDiscountCouponActions } from '@/hooks/useDiscountCoupons';
import {
  CouponTableHeader,
  CouponTableContent,
  CouponDeleteDialog,
  CouponEditDialog
} from './coupon-table';

interface CouponsTableProps {
  coupons: DiscountCoupon[];
  isLoading: boolean;
}

const CouponsTable: React.FC<CouponsTableProps> = ({ coupons, isLoading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<DiscountCoupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { updateCoupon, deleteCoupon } = useDiscountCouponActions();

  const handleEdit = (coupon: DiscountCoupon) => {
    setSelectedCoupon(coupon);
    setIsDialogOpen(true);
  };

  const handleDelete = (coupon: DiscountCoupon) => {
    setSelectedCoupon(coupon);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCoupon) {
      deleteCoupon.mutate(selectedCoupon.id);
    }
    setIsAlertOpen(false);
  };

  // Filter coupons by search term
  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <CouponTableHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <CouponTableContent
        coupons={coupons}
        isLoading={isLoading}
        filteredCoupons={filteredCoupons}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CouponEditDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        selectedCoupon={selectedCoupon}
        onSubmit={(values) => {
          if (selectedCoupon) {
            updateCoupon.mutate({ 
              id: selectedCoupon.id, 
              values 
            });
            setIsDialogOpen(false);
          }
        }}
        isSubmitting={updateCoupon.isPending}
      />

      <CouponDeleteDialog
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        selectedCoupon={selectedCoupon}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default CouponsTable;
