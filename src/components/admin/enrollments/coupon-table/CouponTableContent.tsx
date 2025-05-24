
import React from 'react';
import { DiscountCoupon } from '@/types/enrollment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CouponTableRow from './CouponTableRow';

interface CouponTableContentProps {
  coupons: DiscountCoupon[];
  isLoading: boolean;
  filteredCoupons: DiscountCoupon[];
  onEdit: (coupon: DiscountCoupon) => void;
  onDelete: (coupon: DiscountCoupon) => void;
}

const CouponTableContent: React.FC<CouponTableContentProps> = ({ 
  isLoading, 
  filteredCoupons, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Usos</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                Carregando cupons...
              </TableCell>
            </TableRow>
          ) : filteredCoupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                Nenhum cupom encontrado.
              </TableCell>
            </TableRow>
          ) : (
            filteredCoupons.map((coupon) => (
              <CouponTableRow 
                key={coupon.id}
                coupon={coupon}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CouponTableContent;
