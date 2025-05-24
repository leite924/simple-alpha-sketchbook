
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Send, Download, Printer, Server } from "lucide-react";
import { PaymentTransaction } from "../../types";
import { toast } from "sonner";
import { StoredInvoice } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface InvoiceActionsProps {
  transaction: PaymentTransaction;
  getTransactionInvoice: (transactionId: number) => StoredInvoice | undefined;
  invoiceData: {
    [key: number]: {
      invoiceNumber: string;
      issueDate: string;
      dueDate: string;
      serverId?: string;
    };
  };
  isEmitting: { [key: number]: boolean };
  onInvoiceGeneration: (transaction: PaymentTransaction) => Promise<void>;
  onPrintInvoice: (transaction: PaymentTransaction) => Promise<void>;
  onDownloadInvoice: (transaction: PaymentTransaction) => Promise<void>;
}

export const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  transaction,
  getTransactionInvoice,
  invoiceData,
  isEmitting,
  onInvoiceGeneration,
  onPrintInvoice,
  onDownloadInvoice
}) => {
  const transactionInvoice = getTransactionInvoice(transaction.id);
  
  if (transactionInvoice || invoiceData[transaction.id]?.serverId) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-green-600" />
          <span className="text-green-600">
            Emitida #{transactionInvoice?.invoiceNumber || invoiceData[transaction.id]?.invoiceNumber}
          </span>
          <Server className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => onPrintInvoice(transaction)}
          >
            <Printer className="h-3 w-3" />
            <span>Imprimir</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => onDownloadInvoice(transaction)}
          >
            <Download className="h-3 w-3" />
            <span>Baixar</span>
          </Button>
        </div>
      </div>
    );
  } 
  
  if (transaction.status === "completed") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center gap-1"
            disabled={isEmitting[transaction.id]}
          >
            {isEmitting[transaction.id] ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>Emitindo...</span>
              </>
            ) : (
              <>
                <FileText className="h-3 w-3" />
                <span>Emitir NFS</span>
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emitir e Armazenar Nota Fiscal</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a emitir e armazenar uma nota fiscal para a transação #{transaction.id} no valor de 
              R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
              A nota será armazenada no servidor. Deseja prosseguir?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onInvoiceGeneration(transaction)}>
              <Send className="h-4 w-4 mr-2" />
              Emitir e Armazenar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
  return (
    <button 
      disabled={true}
      className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
    >
      <FileText className="h-3 w-3" />
      Emitir NFS
    </button>
  );
};
