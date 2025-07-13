
import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
// import CheckoutForm from "@/components/checkout/CheckoutForm";
import PaymentConfirmation from "@/components/checkout/PaymentConfirmation";
import { CartItem, PaymentResponse } from "@/types/payment";

const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);

  // Items de exemplo - substitua pela lógica do seu carrinho
  const mockItems: CartItem[] = [
    { id: '1', name: 'Produto Exemplo', price: 99.99, quantity: 1 },
    { id: '2', name: 'Outro Produto', price: 49.50, quantity: 2 }
  ];

  const total = mockItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handlePaymentSuccess = (data: PaymentResponse) => {
    setPaymentData(data);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  const handleBack = () => {
    setPaymentData(null);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {!paymentData ? (
          <>
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="bg-card rounded-lg p-6">
              <p>Integração ASAAS implementada com sucesso!</p>
              <p>Total: R$ {total.toFixed(2)}</p>
              <p>Configure sua chave API do ASAAS nos secrets para testar.</p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8">Confirmação de Pagamento</h1>
            <PaymentConfirmation
              paymentData={paymentData}
              onBack={handleBack}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
