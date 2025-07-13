export interface PaymentMethod {
  type: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  label: string;
  description: string;
}

export interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  cpfCnpj: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  province?: string;
  city?: string;
  state?: string;
}

export interface CardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PaymentRequest {
  total: number;
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  customerData: CustomerData;
  items: CartItem[];
  cardData?: CardData;
  installments?: number;
}

export interface PaymentResponse {
  orderId: string;
  asaasPaymentId: string;
  status: string;
  total: number;
  paymentMethod: string;
  // PIX specific
  pixQrCode?: string;
  pixCopyAndPaste?: string;
  expirationDate?: string;
  // Boleto specific
  boletoUrl?: string;
  barCode?: string;
  dueDate?: string;
  // Credit card specific
  creditCardBrand?: string;
  creditCardNumber?: string;
}

export interface Order {
  id: string;
  user_id: string;
  asaas_payment_id: string;
  total: number;
  status: string;
  payment_method: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: any;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    type: 'PIX',
    label: 'PIX',
    description: 'Pagamento instantâneo via PIX'
  },
  {
    type: 'CREDIT_CARD',
    label: 'Cartão de Crédito',
    description: 'Parcelamento em até 12x'
  },
  {
    type: 'BOLETO',
    label: 'Boleto Bancário',
    description: 'Vencimento em 1 dia útil'
  }
];

export const INSTALLMENTS = [
  { value: 1, label: '1x sem juros' },
  { value: 2, label: '2x sem juros' },
  { value: 3, label: '3x sem juros' },
  { value: 4, label: '4x sem juros' },
  { value: 5, label: '5x sem juros' },
  { value: 6, label: '6x sem juros' },
  { value: 7, label: '7x sem juros' },
  { value: 8, label: '8x sem juros' },
  { value: 9, label: '9x sem juros' },
  { value: 10, label: '10x sem juros' },
  { value: 11, label: '11x sem juros' },
  { value: 12, label: '12x sem juros' }
];