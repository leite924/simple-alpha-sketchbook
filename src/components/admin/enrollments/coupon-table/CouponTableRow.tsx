
import React from 'react';
import { DiscountCoupon } from '@/types/enrollment';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Check, X, Calendar, PercentIcon, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CouponTableRowProps {
  coupon: DiscountCoupon;
  onEdit: (coupon: DiscountCoupon) => void;
  onDelete: (coupon: DiscountCoupon) => void;
}

const CouponTableRow: React.FC<CouponTableRowProps> = ({ coupon, onEdit, onDelete }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{coupon.code}</span>
          {coupon.description && (
            <span className="text-xs text-gray-500">{coupon.description}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {coupon.discount_type === 'percentage' ? (
          <Badge variant="outline" className="flex items-center gap-1">
            <PercentIcon size={12} />
            Percentual
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign size={12} />
            Valor Fixo
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {coupon.discount_type === 'percentage' 
          ? `${coupon.discount_value}%` 
          : `R$ ${coupon.discount_value.toFixed(2)}`
        }
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span className="text-xs">De: {formatDate(coupon.valid_from)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span className="text-xs">Até: {coupon.valid_until ? formatDate(coupon.valid_until) : 'Sem limite'}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        {coupon.is_active ? (
        <Badge variant="outline" className="text-green-600 bg-green-100 flex items-center gap-1">
          <Check size={12} />
          Ativo
        </Badge>
      ) : (
        <Badge variant="destructive" className="flex items-center gap-1">
          <X size={12} />
          Inativo
        </Badge>
      )}
      </TableCell>
      <TableCell>
        {coupon.current_uses} {coupon.max_uses ? `/ ${coupon.max_uses}` : ''}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(coupon)}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(coupon)}
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CouponTableRow;
