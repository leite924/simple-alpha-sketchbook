
export type CheckoutFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  address: string;
  addressNumber: string;
  addressComplement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: 'credit_card' | 'pix' | 'bank_slip';
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
  installments?: number;
  classId: string;
  couponCode?: string;
  agreeTerms: boolean;
};

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'canceled';
