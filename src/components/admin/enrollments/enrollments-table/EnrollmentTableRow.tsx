
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EnrollmentWithDetails } from '@/types/enrollment';
import EnrollmentStatusBadge from './EnrollmentStatusBadge';

interface EnrollmentTableRowProps {
  enrollment: EnrollmentWithDetails;
  onViewDetails: (enrollment: EnrollmentWithDetails) => void;
}

const EnrollmentTableRow: React.FC<EnrollmentTableRowProps> = ({ enrollment, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {enrollment.student_name}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{enrollment.course_name}</span>
          <span className="text-xs text-gray-500">{enrollment.class_name?.split(' - ')[1]}</span>
        </div>
      </TableCell>
      <TableCell>
        {formatDate(enrollment.enrollment_date)}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{formatCurrency(enrollment.payment_amount)}</span>
          {enrollment.discount_amount && enrollment.discount_amount > 0 && (
            <span className="text-xs text-green-600">
              Desconto: {formatCurrency(enrollment.discount_amount)}
              {enrollment.coupon_code && ` (${enrollment.coupon_code})`}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <EnrollmentStatusBadge status={enrollment.payment_status} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(enrollment)}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
          >
            <Printer size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EnrollmentTableRow;
