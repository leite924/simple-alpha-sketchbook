
import React from "react";
import { CheckCircle, Clock, XCircle, AlertTriangle, FileText } from "lucide-react";

interface TransactionStatusIndicatorProps {
  status: 'pending' | 'completed' | 'failed' | 'processing' | 'canceled';
  type?: 'payment' | 'nfse';
}

export const TransactionStatusIndicator: React.FC<TransactionStatusIndicatorProps> = ({ 
  status, 
  type = 'payment' 
}) => {
  // Mapeia os status para textos e cores com base no tipo (pagamento ou NFS-e)
  const statusConfig = {
    payment: {
      completed: { text: "Completado", icon: CheckCircle, className: "text-green-600" },
      pending: { text: "Pendente", icon: Clock, className: "text-amber-600" },
      failed: { text: "Falhou", icon: XCircle, className: "text-red-600" },
      processing: { text: "Processando", icon: Clock, className: "text-blue-600" },
      canceled: { text: "Cancelado", icon: AlertTriangle, className: "text-gray-600" },
    },
    nfse: {
      completed: { text: "Emitida", icon: FileText, className: "text-green-600" },
      pending: { text: "Aguardando", icon: Clock, className: "text-amber-600" },
      failed: { text: "Rejeitada", icon: XCircle, className: "text-red-600" },
      processing: { text: "Processando", icon: Clock, className: "text-blue-600" },
      canceled: { text: "Cancelada", icon: AlertTriangle, className: "text-gray-600" },
    }
  };

  const config = statusConfig[type][status] || statusConfig[type].pending;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${config.className}`} />
      <span className={`${config.className} font-medium`}>{config.text}</span>
    </div>
  );
};
