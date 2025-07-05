
import { supabase } from '@/integrations/supabase/client';

// Configuração do Pagarme - substitua pela sua chave real
const PAGARME_API_KEY = 'ak_test_e1QGU2gL98MDCHZxHYQxRdSL6Azumo'; // Sua chave de teste
const PAGARME_BASE_URL = 'https://api.pagar.me/core/v5';

// Types for Pagarme transactions
export interface PagarmeTransaction {
  id: string;
  status: string;
  amount: number;
  paymentMethod: string;
  cardBrand?: string;
  installments?: number;
  customerName: string;
  customerEmail: string;
  pixQrCode?: string;
  pixCode?: string;
  boletoUrl?: string;
  createdAt: Date;
}

// Função para criar cliente no Pagarme
const createCustomer = async (customerData: any) => {
  const response = await fetch(`${PAGARME_BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAGARME_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `${customerData.firstName} ${customerData.lastName}`,
      email: customerData.email,
      document: customerData.cpf.replace(/\D/g, ''),
      type: 'individual',
      phones: {
        mobile_phone: {
          country_code: '55',
          area_code: customerData.phone.substring(0, 2),
          number: customerData.phone.substring(2)
        }
      },
      address: {
        line_1: `${customerData.address.street}, ${customerData.address.number}`,
        line_2: customerData.address.complement || '',
        zip_code: customerData.address.zipCode.replace(/\D/g, ''),
        city: customerData.address.city,
        state: customerData.address.state,
        country: 'BR'
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Erro ao criar cliente: ${error.message}`);
  }

  return await response.json();
};

// Process card payment
export const processCardPayment = async (
  cardData: any,
  customer: any,
  amount: number,
  items: any[]
): Promise<PagarmeTransaction> => {
  try {
    // Criar cliente no Pagarme
    const pagarmeCustomer = await createCustomer(customer);

    // Criar transação com cartão
    const response = await fetch(`${PAGARME_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAGARME_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: pagarmeCustomer.id,
        items: items.map(item => ({
          amount: item.unitPrice,
          description: item.title,
          quantity: item.quantity
        })),
        payments: [{
          payment_method: 'credit_card',
          credit_card: {
            installments: cardData.installments,
            statement_descriptor: 'MATRICULA',
            card: {
              number: cardData.number,
              holder_name: cardData.holderName,
              exp_month: cardData.expiryDate.split('/')[0],
              exp_year: `20${cardData.expiryDate.split('/')[1]}`,
              cvv: cardData.cvv
            }
          }
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro no pagamento: ${error.message || 'Erro desconhecido'}`);
    }

    const result = await response.json();
    
    // Salvar transação no banco local
    await saveTransactionToSupabase(customer.userId || '', {
      id: result.id,
      status: result.status,
      amount: amount / 100,
      paymentMethod: 'credit_card',
      cardBrand: cardData.brand || 'unknown',
      installments: cardData.installments,
      customerName: customer.name,
      customerEmail: customer.email,
      createdAt: new Date()
    });

    return {
      id: result.id,
      status: result.status,
      amount: amount / 100,
      paymentMethod: 'credit_card',
      cardBrand: cardData.brand || 'unknown',
      installments: cardData.installments,
      customerName: customer.name,
      customerEmail: customer.email,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Erro no processamento do cartão:', error);
    throw error;
  }
};

// Generate PIX payment
export const generatePixPayment = async (
  customer: any,
  amount: number,
  items: any[]
): Promise<{ paymentUrl: string, transactionId: string, pixQrCode: string, pixCode: string }> => {
  try {
    // Criar cliente no Pagarme
    const pagarmeCustomer = await createCustomer(customer);

    // Criar transação PIX
    const response = await fetch(`${PAGARME_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAGARME_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: pagarmeCustomer.id,
        items: items.map(item => ({
          amount: item.unitPrice,
          description: item.title,
          quantity: item.quantity
        })),
        payments: [{
          payment_method: 'pix',
          pix: {
            expires_in: 3600 // 1 hora para expirar
          }
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao gerar PIX: ${error.message || 'Erro desconhecido'}`);
    }

    const result = await response.json();
    const pixData = result.charges[0].last_transaction;

    // Salvar transação no banco local
    await saveTransactionToSupabase(customer.userId || '', {
      id: result.id,
      status: result.status,
      amount: amount / 100,
      paymentMethod: 'pix',
      customerName: customer.name,
      customerEmail: customer.email,
      pixQrCode: pixData.qr_code,
      pixCode: pixData.qr_code_url,
      createdAt: new Date()
    });

    return {
      paymentUrl: pixData.qr_code_url,
      transactionId: result.id,
      pixQrCode: pixData.qr_code,
      pixCode: pixData.qr_code_url
    };
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    throw error;
  }
};

// Generate boleto payment
export const generateBoletoPayment = async (
  customer: any,
  amount: number,
  items: any[]
): Promise<{ paymentUrl: string, transactionId: string }> => {
  try {
    // Criar cliente no Pagarme
    const pagarmeCustomer = await createCustomer(customer);

    // Criar transação com boleto
    const response = await fetch(`${PAGARME_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAGARME_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: pagarmeCustomer.id,
        items: items.map(item => ({
          amount: item.unitPrice,
          description: item.title,
          quantity: item.quantity
        })),
        payments: [{
          payment_method: 'boleto',
          boleto: {
            instructions: 'Pagamento referente à matrícula no curso',
            due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 dias
          }
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao gerar boleto: ${error.message || 'Erro desconhecido'}`);
    }

    const result = await response.json();
    const boletoData = result.charges[0].last_transaction;

    // Salvar transação no banco local
    await saveTransactionToSupabase(customer.userId || '', {
      id: result.id,
      status: result.status,
      amount: amount / 100,
      paymentMethod: 'boleto',
      customerName: customer.name,
      customerEmail: customer.email,
      boletoUrl: boletoData.url,
      createdAt: new Date()
    });

    return {
      paymentUrl: boletoData.url,
      transactionId: result.id
    };
  } catch (error) {
    console.error('Erro ao gerar boleto:', error);
    throw error;
  }
};

// Generate payment link (Pix or boleto)
export const generatePaymentLink = async (
  customer: any,
  amount: number,
  paymentMethod: 'boleto' | 'pix',
  items: any[]
): Promise<{ paymentUrl: string, transactionId: string }> => {
  if (paymentMethod === 'pix') {
    const result = await generatePixPayment(customer, amount, items);
    return {
      paymentUrl: result.paymentUrl,
      transactionId: result.transactionId
    };
  } else {
    return await generateBoletoPayment(customer, amount, items);
  }
};

// Check transaction status
export const checkTransactionStatus = async (transactionId: string): Promise<string> => {
  try {
    const response = await fetch(`${PAGARME_BASE_URL}/orders/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${PAGARME_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao verificar status da transação');
    }

    const result = await response.json();
    return result.status;
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    throw error;
  }
};

// Save transaction to Supabase
export const saveTransactionToSupabase = async (
  userId: string, 
  transaction: PagarmeTransaction
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        pagarme_transaction_id: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        method: transaction.paymentMethod,
        customer_name: transaction.customerName,
        customer_email: transaction.customerEmail,
        card_brand: transaction.cardBrand,
        installments: transaction.installments,
        pix_qr_code: transaction.pixQrCode,
        pix_code: transaction.pixCode,
        boleto_url: transaction.boletoUrl
      });

    if (error) {
      console.error('Erro ao salvar transação:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao salvar no Supabase:', error);
    throw error;
  }
};
