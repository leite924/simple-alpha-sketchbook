
import { useState } from "react";
import { PaymentTransaction } from "@/components/admin/types";
import { StoredInvoice } from "../types";
import { toast } from "sonner";

interface UseInvoiceActionsProps {
  storeInvoice: (invoice: Omit<StoredInvoice, 'id' | 'createdAt'>) => Promise<StoredInvoice>;
  updateInvoiceStatus: (invoiceId: string, status: StoredInvoice['status']) => Promise<StoredInvoice>;
  getTransactionInvoice: (transactionId: number) => StoredInvoice | undefined;
}

export const useInvoiceActions = ({
  storeInvoice,
  updateInvoiceStatus,
  getTransactionInvoice
}: UseInvoiceActionsProps) => {
  const [isEmitting, setIsEmitting] = useState<{ [key: number]: boolean }>({});
  const [invoiceData, setInvoiceData] = useState<{
    [key: number]: {
      invoiceNumber: string;
      issueDate: string;
      dueDate: string;
      serverId?: string;
    };
  }>({});

  const handleInvoiceGeneration = async (transaction: PaymentTransaction) => {
    setIsEmitting(prev => ({ ...prev, [transaction.id]: true }));
    
    try {
      const invoiceNumber = `NF-${Date.now()}`;
      const issueDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Store invoice in local state
      setInvoiceData(prev => ({
        ...prev,
        [transaction.id]: {
          invoiceNumber,
          issueDate,
          dueDate,
          serverId: `server-${Date.now()}`
        }
      }));

      // Create stored invoice record
      const storedInvoice = await storeInvoice({
        transactionId: transaction.id,
        invoiceNumber,
        issueDate,
        amount: transaction.amount,
        clientName: transaction.userName,
        clientId: parseInt(transaction.userId || "0"),
        description: transaction.description,
        status: "processed"
      });

      toast.success("Nota fiscal gerada com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar nota fiscal:", error);
      toast.error("Erro ao gerar nota fiscal");
    } finally {
      setIsEmitting(prev => ({ ...prev, [transaction.id]: false }));
    }
  };

  const handlePrintInvoice = async (transaction: PaymentTransaction) => {
    try {
      const invoice = getTransactionInvoice(transaction.id);
      if (invoice) {
        await updateInvoiceStatus(invoice.id, "printed");
        toast.success("Nota fiscal enviada para impressão!");
      }
    } catch (error) {
      console.error("Erro ao imprimir nota fiscal:", error);
      toast.error("Erro ao imprimir nota fiscal");
    }
  };

  const handleDownloadInvoice = async (transaction: PaymentTransaction) => {
    try {
      const invoice = getTransactionInvoice(transaction.id);
      if (invoice) {
        await updateInvoiceStatus(invoice.id, "downloaded");
        toast.success("Download da nota fiscal iniciado!");
      }
    } catch (error) {
      console.error("Erro ao baixar nota fiscal:", error);
      toast.error("Erro ao baixar nota fiscal");
    }
  };

  return {
    isEmitting,
    invoiceData,
    handleInvoiceGeneration,
    handlePrintInvoice,
    handleDownloadInvoice
  };
};
