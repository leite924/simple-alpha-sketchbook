
import React from 'react';
import { DiscountCoupon, DiscountCouponFormValues } from '@/types/enrollment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import CouponForm from '../CouponForm';

interface CouponEditDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  selectedCoupon: DiscountCoupon | null;
  onSubmit: (values: DiscountCouponFormValues) => void;
  isSubmitting: boolean;
}

const CouponEditDialog: React.FC<CouponEditDialogProps> = ({ 
  isOpen, 
  setIsOpen, 
  selectedCoupon, 
  onSubmit,
  isSubmitting
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Cupom</DialogTitle>
        </DialogHeader>
        {selectedCoupon && (
          <CouponForm
            initialData={selectedCoupon}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CouponEditDialog;
