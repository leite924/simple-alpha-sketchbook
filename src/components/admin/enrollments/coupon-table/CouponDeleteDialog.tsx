
import React from 'react';
import { DiscountCoupon } from '@/types/enrollment';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CouponDeleteDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  selectedCoupon: DiscountCoupon | null;
  onConfirm: () => void;
}

const CouponDeleteDialog: React.FC<CouponDeleteDialogProps> = ({ 
  isOpen, 
  setIsOpen, 
  selectedCoupon, 
  onConfirm 
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o cupom <strong>{selectedCoupon?.code}</strong>? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CouponDeleteDialog;
