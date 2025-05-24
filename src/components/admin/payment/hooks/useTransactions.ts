
import { useState } from "react";
import { PaymentTransaction } from "@/components/admin/types";
import { StoredInvoice } from "../types";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

export const useTransactions = () => {
  const [transactions] = useState<PaymentTransaction[]>([
    {
      id: 1,
      userName: "João Silva",
      description: "Matrícula - Curso de Fotografia Básica",
      amount: 299.90,
      date: new Date("2024-02-01"),
      status: "completed",
      paymentMethod: "Cartão de Crédito",
      userId: "1",
    },
    {
      id: 2,
      userName: "Maria Santos",
      description: "Matrícula - Workshop de Edição",
      amount: 150.00,
      date: new Date("2024-01-28"),
      status: "completed",
      paymentMethod: "PIX",
      userId: "2",
    },
    {
      id: 3,
      userName: "Carlos Oliveira",
      description: "Matrícula - Curso Avançado",
      amount: 599.00,
      date: new Date("2024-01-25"),
      status: "pending",
      paymentMethod: "Boleto",
      userId: "3",
    },
    {
      id: 4,
      userName: "Ana Costa",
      description: "Workshop de Iluminação",
      amount: 199.90,
      date: new Date("2024-01-20"),
      status: "failed",
      paymentMethod: "Cartão de Crédito",
      userId: "4",
    }
  ]);

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
