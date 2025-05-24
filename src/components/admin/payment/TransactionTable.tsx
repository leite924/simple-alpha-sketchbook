
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentTransaction } from "../types";
import { StoredInvoice } from "./types";
import { TransactionTableRow } from "./TransactionTableRow";
import { useInvoiceActions } from "./hooks/useInvoiceActions";

interface TransactionTableProps {
  transactions: PaymentTransaction[];
  searchTerm: string;
  storedInvoices: StoredInvoice[];
  storeInvoice: (invoice: Omit<StoredInvoice, 'id' | 'createdAt'>) => Promise<StoredInvoice>;
  updateInvoiceStatus: (invoiceId: string, status: StoredInvoice['status']) => Promise<StoredInvoice>;
}

export const TransactionTable = ({ 
  transactions, 
  storedInvoices, 
  storeInvoice, 
  updateInvoiceStatus 
}: TransactionTableProps) => {
  // Verifica se uma transação já tem nota fiscal emitida
  const getTransactionInvoice = (transactionId: number) => {
    return storedInvoices.find(invoice => invoice.transactionId === transactionId);
  };

  const { 
    isEmitting,
    invoiceData, 
    handleInvoiceGeneration, 
    handlePrintInvoice, 
    handleDownloadInvoice 
  } = useInvoiceActions({
    storeInvoice,
    updateInvoiceStatus,
    getTransactionInvoice
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Nota Fiscal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions.map(transaction => (
            <TransactionTableRow
              key={transaction.id}
              transaction={transaction}
              getTransactionInvoice={getTransactionInvoice}
              invoiceData={invoiceData}
              isEmitting={isEmitting}
              onInvoiceGeneration={handleInvoiceGeneration}
              onPrintInvoice={handlePrintInvoice}
              onDownloadInvoice={handleDownloadInvoice}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6">
              Nenhuma transação encontrada.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
