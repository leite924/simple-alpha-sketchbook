
// This file contains types for the Pagarme integration

// Types for payment processing
export interface PaymentCardData {
  holderName: string;
  number: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  brand?: string;
  installments?: number;
}

export interface PaymentCustomer {
  name: string;
  email: string;
  document?: string;
  userId?: string;
}

export interface PaymentItem {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

// Types for transactions
export interface PaymentTransactionData {
  id: string;
  user_id?: string;
  pagarme_transaction_id: string;
  status: string;
  amount: number;
  method: string;
  customer_name?: string;
  customer_email?: string;
  card_brand?: string;
  installments?: number;
  created_at?: string;
  updated_at?: string;
}
