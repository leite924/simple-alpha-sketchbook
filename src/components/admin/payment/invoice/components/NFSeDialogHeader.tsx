
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { TransactionStatusIndicator } from "../../TransactionStatusIndicator";
import { NFSeData } from "../types";

interface NFSeDialogHeaderProps {
  nfseData: NFSeData;
  protocol?: string;
  transactionId?: string;
}

export const NFSeDialogHeader: React.FC<NFSeDialogHeaderProps> = ({ 
  nfseData, 
  protocol,
  transactionId
}) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-green-600" />
        <span>Nota Fiscal de Serviço Eletrônica</span>
        {protocol && <span className="text-sm text-muted-foreground ml-2">Protocolo: {protocol}</span>}
      </DialogTitle>
      
      <div className="flex items-center justify-between mt-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">NFS-e #{nfseData.numeroLote}</p>
          {transactionId && (
            <p className="text-xs text-muted-foreground">
              Transação ID: {transactionId}
            </p>
          )}
        </div>
        <TransactionStatusIndicator status={nfseData.status || 'completed'} type="nfse" />
      </div>
    </DialogHeader>
  );
};
