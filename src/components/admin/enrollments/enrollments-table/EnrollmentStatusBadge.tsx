
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertTriangle, X } from 'lucide-react';

interface EnrollmentStatusBadgeProps {
  status: string;
}

const EnrollmentStatusBadge: React.FC<EnrollmentStatusBadgeProps> = ({ status }) => {
  switch(status) {
    case 'paid':
      return (
        <Badge variant="outline" className="text-green-600 bg-green-100 flex items-center gap-1">
          <Check size={12} />
          Pago
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="text-orange-600 bg-orange-100 flex items-center gap-1">
          <Clock size={12} />
          Pendente
        </Badge>
      );
    case 'overdue':
      return (
        <Badge variant="outline" className="text-red-600 bg-red-100 flex items-center gap-1">
          <AlertTriangle size={12} />
          Vencido
        </Badge>
      );
    case 'canceled':
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <X size={12} />
          Cancelado
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default EnrollmentStatusBadge;
