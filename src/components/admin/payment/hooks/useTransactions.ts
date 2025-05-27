
import { useState } from "react";
import { PaymentTransaction } from "@/components/admin/types";
import { StoredInvoice } from "../types";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

export const useTransactions = () => {
  // Removendo dados mocados - agora usa array vazio
  const [transactions] = useState<PaymentTransaction[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [storedInvoices, setStoredInvoices] = useState<StoredInvoice[]>([]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateRange?.from || !dateRange?.to || 
      (transaction.date >= dateRange.from && transaction.date <= dateRange.to);
    
    return matchesSearch && matchesDate;
  });

  const storeInvoice = async (invoice: Omit<StoredInvoice, 'id' | 'createdAt'>): Promise<StoredInvoice> => {
    const newInvoice: StoredInvoice = {
      ...invoice,
      id: `invoice-${Date.now()}`,
      createdAt: new Date()
    };
    
    setStoredInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoiceStatus = async (invoiceId: string, status: StoredInvoice['status']): Promise<StoredInvoice> => {
    const updatedInvoice = storedInvoices.find(inv => inv.id === invoiceId);
    if (!updatedInvoice) {
      throw new Error('Invoice not found');
    }
    
    const updated = { ...updatedInvoice, status };
    setStoredInvoices(prev => prev.map(inv => inv.id === invoiceId ? updated : inv));
    return updated;
  };

  const handleExportTransactions = () => {
    toast.success("Exportação de transações iniciada!");
    console.log("Exporting transactions:", filteredTransactions);
  };

  return {
    transactions: filteredTransactions,
    filteredTransactions,
    storedInvoices,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    storeInvoice,
    updateInvoiceStatus,
    handleExportTransactions,
    totalTransactions: transactions.length
  };
};
