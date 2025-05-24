
import { useState } from "react";
import { PaymentTransaction } from "../../types";
import { StoredInvoice } from "../types";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

export const useTransactions = () => {
  // Simulated transaction data - in a real app would come from an API
  const [transactions] = useState<PaymentTransaction[]>([
    {
      id: 1,
      userId: 101,
      userName: "Carlos Silva",
      amount: 990.00,
      status: "completed",
      date: new Date("2025-05-05"),
      method: "credit_card",
      description: "Matrícula - JavaScript Avançado"
    },
    {
      id: 2,
      userId: 102,
      userName: "Ana Oliveira",
      amount: 1200.00,
      status: "completed",
      date: new Date("2025-05-04"),
      method: "credit_card",
      description: "Matrícula - React Framework"
    },
    {
      id: 3,
      userId: 103,
      userName: "Roberto Almeida",
      amount: 890.00,
      status: "pending",
      date: new Date("2025-05-06"),
      method: "credit_card",
      description: "Matrícula - UX/UI Design"
    },
    {
      id: 4,
      userId: 104,
      userName: "Juliana Santos",
      amount: 990.00,
      status: "failed",
      date: new Date("2025-05-05"),
      method: "credit_card",
      description: "Matrícula - JavaScript Avançado"
    }
  ]);

  // Simulated server storage for invoices
  const [storedInvoices, setStoredInvoices] = useState<StoredInvoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Server simulation: Store invoice data
  const storeInvoice = (invoice: Omit<StoredInvoice, 'id' | 'createdAt'>) => {
    return new Promise<StoredInvoice>((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        try {
          // Generate a unique ID for the invoice
          const newInvoice: StoredInvoice = {
            ...invoice,
            id: `inv_${Date.now()}`,
            createdAt: new Date()
          };
          
          // Update stored invoices
          setStoredInvoices(prev => [...prev, newInvoice]);
          
          // Simulate successful server response
          resolve(newInvoice);
          toast.success(`Nota fiscal ${invoice.invoiceNumber} armazenada no servidor com sucesso`);
        } catch (error) {
          // Simulate server error
          reject(new Error("Falha ao armazenar a nota fiscal no servidor"));
          toast.error("Erro ao armazenar a nota fiscal no servidor");
        }
      }, 800); // Simulate network delay
    });
  };

  // Server simulation: Get stored invoice
  const getInvoice = (invoiceId: string) => {
    return new Promise<StoredInvoice | undefined>((resolve, reject) => {
      setTimeout(() => {
        try {
          const invoice = storedInvoices.find(inv => inv.id === invoiceId);
          if (invoice) {
            resolve(invoice);
          } else {
            reject(new Error("Nota fiscal não encontrada"));
          }
        } catch (error) {
          reject(new Error("Erro ao buscar nota fiscal"));
        }
      }, 500);
    });
  };

  // Server simulation: Update invoice status
  const updateInvoiceStatus = (invoiceId: string, status: StoredInvoice['status']) => {
    return new Promise<StoredInvoice>((resolve, reject) => {
      setTimeout(() => {
        try {
          setStoredInvoices(prev => {
            const updated = prev.map(inv => {
              if (inv.id === invoiceId) {
                return { ...inv, status };
              }
              return inv;
            });
            
            const updatedInvoice = updated.find(inv => inv.id === invoiceId);
            if (updatedInvoice) {
              resolve(updatedInvoice);
            } else {
              reject(new Error("Nota fiscal não encontrada"));
            }
            
            return updated;
          });
        } catch (error) {
          reject(new Error("Erro ao atualizar status da nota fiscal"));
          toast.error("Erro ao atualizar status da nota fiscal");
        }
      }, 500);
    });
  };

  // Filter transactions based on both search term and date range
  const filteredTransactions = transactions.filter((tx) => {
    // Search term filter
    const matchesSearch = 
      tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    let withinDateRange = true;
    if (dateRange?.from) {
      withinDateRange = tx.date >= dateRange.from;
      
      if (dateRange.to) {
        // Add one day to make the range inclusive
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        withinDateRange = withinDateRange && tx.date < endDate;
      }
    }
    
    return matchesSearch && withinDateRange;
  });

  const handleExportTransactions = () => {
    toast.success("Relatório de transações exportado com sucesso!");
  };

  return {
    transactions,
    filteredTransactions,
    storedInvoices,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    storeInvoice,
    getInvoice,
    updateInvoiceStatus,
    handleExportTransactions
  };
};
