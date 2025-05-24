
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EnrollmentWithDetails } from '@/types/enrollment';
import { useManualEnrollmentActions } from '@/hooks/useManualEnrollments';
import EnrollmentStatusBadge from './EnrollmentStatusBadge';

interface EnrollmentDetailsDialogProps {
  enrollment: EnrollmentWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const EnrollmentDetailsDialog: React.FC<EnrollmentDetailsDialogProps> = ({
  enrollment,
  isOpen,
  onClose
}) => {
  const { cancelEnrollment } = useManualEnrollmentActions();

  if (!enrollment) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCancelEnrollment = () => {
    if (confirm('Tem certeza que deseja cancelar esta matrícula?')) {
      cancelEnrollment.mutate(enrollment.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Matrícula</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm">Aluno</h3>
              <p>{enrollment.student_name}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Data da Matrícula</h3>
              <p>{formatDate(enrollment.enrollment_date)}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm">Curso / Turma</h3>
            <p>{enrollment.class_name}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-sm">Valor Original</h3>
              <p>{formatCurrency(enrollment.original_amount)}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Desconto</h3>
              <p>{enrollment.discount_amount ? formatCurrency(enrollment.discount_amount) : '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Valor Final</h3>
              <p className="font-medium">{formatCurrency(enrollment.payment_amount)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm">Status do Pagamento</h3>
              <div className="mt-1">
                <EnrollmentStatusBadge status={enrollment.payment_status} />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm">Cupom Aplicado</h3>
              <p>{enrollment.coupon_code || '-'}</p>
            </div>
          </div>
          
          {enrollment.notes && (
            <div>
              <h3 className="font-medium text-sm">Observações</h3>
              <p className="text-sm">{enrollment.notes}</p>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            {enrollment.payment_status !== 'canceled' && (
              <Button 
                variant="destructive"
                onClick={handleCancelEnrollment}
              >
                Cancelar Matrícula
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentDetailsDialog;
