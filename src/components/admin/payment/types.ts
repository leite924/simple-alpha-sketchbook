
import { PaymentTransaction } from "../types";

// Interface for storing invoice data
export interface StoredInvoice {
  id: string;
  transactionId: number;
  invoiceNumber: string;
  issueDate: string;
  amount: number;
  clientName: string;
  clientId: number;
  description: string;
  status: "processed" | "sent" | "downloaded" | "printed";
  createdAt: Date;
}

export interface PaymentGatewayProps {
  activeTab?: "transactions" | "settings";
  onTabChange?: (tab: "transactions" | "settings") => void;
}
