
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { PaymentTransaction } from "../types";
import { StoredInvoice } from "./types";
import { InvoiceActions } from "./invoice/InvoiceActions";
import { TransactionStatusIndicator } from "./TransactionStatusIndicator";

interface TransactionTableRowProps {
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

export const TransactionTableRow: React.FC<TransactionTableRowProps> = ({
  transaction,
  getTransactionInvoice,
  invoiceData,
  isEmitting,
  onInvoiceGeneration,
  onPrintInvoice,
  onDownloadInvoice
}) => {
  return (
    <TableRow key={transaction.id}>
      <TableCell>#{transaction.id}</TableCell>
      <TableCell>{transaction.userName}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell>
        R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </TableCell>
      <TableCell>{transaction.date.toLocaleDateString('pt-BR')}</TableCell>
      <TableCell>
        <TransactionStatusIndicator status={transaction.status} />
      </TableCell>
      <TableCell>
        <InvoiceActions
          transaction={transaction}
          getTransactionInvoice={getTransactionInvoice}
          invoiceData={invoiceData}
          isEmitting={isEmitting}
          onInvoiceGeneration={onInvoiceGeneration}
          onPrintInvoice={onPrintInvoice}
          onDownloadInvoice={onDownloadInvoice}
        />
      </TableCell>
    </TableRow>
  );
};
