
import { Database } from "@/integrations/supabase/types";

// Types exported from the database - using placeholder types since tables don't exist yet
export type FinancialCategory = { id: string, name: string, description?: string };
export type Receivable = { id: string, amount: number, status: string };
export type Payable = { id: string, amount: number, status: string };
export type Transaction = Database['public']['Tables']['transactions']['Row'];

// Types for forms
export type CategoryFormValues = Omit<FinancialCategory, 'id' | 'created_at' | 'updated_at'>;
export type ReceivableFormValues = {
  description: string;
  amount: number | string;
  customer: string;
  due_date: string;
  status: 'pending' | 'received' | 'cancelled';
  category_id?: string;
  payment_date?: string | null;
};

export type PayableFormValues = {
  description: string;
  amount: number | string;
  supplier: string;
  due_date: string;
  status: 'pending' | 'paid' | 'cancelled';
  category_id?: string;
  payment_date?: string | null;
};

export type TransactionFormValues = {
  description: string;
  amount: number | string;
  type: 'income' | 'expense' | 'transfer' | 'refund';
  transaction_date: string;
  notes?: string;
  reference_id?: string | null;
  reference_type?: string | null;
};

// Payment status
export type PaymentStatus = 'pending' | 'paid' | 'received' | 'cancelled' | 'overdue';

// Transaction type
export type TransactionType = 'income' | 'expense' | 'transfer' | 'refund';

// Financial statistics
export type FinancialStats = {
  totalReceivables: number;
  totalPayables: number;
  currentBalance: number;
  pendingReceivables: number;
  pendingPayables: number;
};
