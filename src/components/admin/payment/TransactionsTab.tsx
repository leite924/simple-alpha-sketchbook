
import React from "react";
import { TransactionSearch } from "./TransactionSearch";
import { TransactionStats } from "./TransactionStats";
import { TransactionTable } from "./TransactionTable";
import { StoredInvoice } from "./types";
import { PaymentTransaction } from "../types";
import { DateRange } from "react-day-picker";

interface TransactionsTabProps {
  filteredTransactions: PaymentTransaction[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  handleExportTransactions: () => void;
  storedInvoices: StoredInvoice[];
  storeInvoice: (invoice: Omit<StoredInvoice, 'id' | 'createdAt'>) => Promise<StoredInvoice>;
  updateInvoiceStatus: (invoiceId: string, status: StoredInvoice['status']) => Promise<StoredInvoice>;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({
  filteredTransactions,
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  handleExportTransactions,
  storedInvoices,
  storeInvoice,
  updateInvoiceStatus
}) => {
  return (
    <>
      <TransactionSearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onExport={handleExportTransactions}
      />
      <TransactionStats transactions={filteredTransactions} />
      <TransactionTable 
        transactions={filteredTransactions}
        searchTerm={searchTerm}
        storedInvoices={storedInvoices}
        storeInvoice={storeInvoice}
        updateInvoiceStatus={updateInvoiceStatus}
      />
    </>
  );
};
