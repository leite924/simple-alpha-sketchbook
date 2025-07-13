import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  total: number;
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  customerData: {
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
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  cardData?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  installments?: number;
}

interface AsaasCustomer {
  id?: string;
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

interface AsaasPayment {
  customer: string;
  billingType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  value: number;
  dueDate: string;
  description: string;
  externalReference?: string;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement?: string;
    phone: string;
  };
  installmentCount?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== PROCESS PAYMENT START ===');
    
    // Verificar autenticação
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Token de autorização não fornecido');
    }

    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { authorization: authHeader }
      }
    });

    // Verificar usuário autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    console.log('Usuário autenticado:', user.id);

    // Parse do body da requisição
    const paymentData: PaymentRequest = await req.json();
    console.log('Dados do pagamento:', JSON.stringify(paymentData, null, 2));

    // Validar dados obrigatórios
    if (!paymentData.total || paymentData.total <= 0) {
      throw new Error('Valor do pagamento inválido');
    }

    if (!paymentData.customerData || !paymentData.customerData.name || !paymentData.customerData.email) {
      throw new Error('Dados do cliente incompletos');
    }

    if (!paymentData.items || paymentData.items.length === 0) {
      throw new Error('Items do pedido não informados');
    }

    // Configurar ASAAS API
    const asaasApiKey = Deno.env.get('ASAAS_API_KEY');
    if (!asaasApiKey) {
      throw new Error('Chave API do ASAAS não configurada');
    }

    const asaasHeaders = {
      'Content-Type': 'application/json',
      'access_token': asaasApiKey,
      'User-Agent': 'Lovable App'
    };

    // Verificar se cliente já existe no ASAAS
    let asaasCustomerId: string;
    
    const { data: existingCustomer } = await supabase
      .from('asaas_customers')
      .select('asaas_customer_id')
      .eq('user_id', user.id)
      .eq('email', paymentData.customerData.email)
      .single();

    if (existingCustomer) {
      asaasCustomerId = existingCustomer.asaas_customer_id;
      console.log('Cliente existente encontrado:', asaasCustomerId);
    } else {
      // Criar cliente no ASAAS
      console.log('Criando novo cliente no ASAAS...');
      
      const customerPayload: AsaasCustomer = {
        name: paymentData.customerData.name,
        email: paymentData.customerData.email,
        phone: paymentData.customerData.phone,
        cpfCnpj: paymentData.customerData.cpfCnpj,
        postalCode: paymentData.customerData.postalCode?.replace(/\D/g, ''),
        address: paymentData.customerData.address,
        addressNumber: paymentData.customerData.addressNumber,
        province: paymentData.customerData.province,
        city: paymentData.customerData.city,
        state: paymentData.customerData.state
      };

      console.log('Payload do cliente:', JSON.stringify(customerPayload, null, 2));

      const customerResponse = await fetch('https://sandbox.asaas.com/api/v3/customers', {
        method: 'POST',
        headers: asaasHeaders,
        body: JSON.stringify(customerPayload)
      });

      const customerResult = await customerResponse.json();
      console.log('Resposta criação cliente:', JSON.stringify(customerResult, null, 2));

      if (!customerResponse.ok) {
        throw new Error(`Erro ao criar cliente no ASAAS: ${JSON.stringify(customerResult)}`);
      }

      asaasCustomerId = customerResult.id;

      // Salvar cliente no banco local
      const { error: customerError } = await supabase
        .from('asaas_customers')
        .insert({
          user_id: user.id,
          asaas_customer_id: asaasCustomerId,
          name: paymentData.customerData.name,
          email: paymentData.customerData.email,
          phone: paymentData.customerData.phone
        });

      if (customerError) {
        console.error('Erro ao salvar cliente local:', customerError);
      }
    }

    // Preparar dados do pagamento
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1); // Vencimento para amanhã

    const paymentPayload: AsaasPayment = {
      customer: asaasCustomerId,
      billingType: paymentData.paymentMethod,
      value: paymentData.total,
      dueDate: dueDate.toISOString().split('T')[0],
      description: `Pedido - ${paymentData.items.map(item => item.name).join(', ')}`,
      externalReference: user.id
    };

    // Configurações específicas por método de pagamento
    if (paymentData.paymentMethod === 'CREDIT_CARD') {
      if (!paymentData.cardData) {
        throw new Error('Dados do cartão são obrigatórios para pagamento no cartão');
      }

      paymentPayload.creditCard = {
        holderName: paymentData.cardData.holderName,
        number: paymentData.cardData.number.replace(/\D/g, ''),
        expiryMonth: paymentData.cardData.expiryMonth,
        expiryYear: paymentData.cardData.expiryYear,
        ccv: paymentData.cardData.ccv
      };

      paymentPayload.creditCardHolderInfo = {
        name: paymentData.customerData.name,
        email: paymentData.customerData.email,
        cpfCnpj: paymentData.customerData.cpfCnpj,
        postalCode: paymentData.customerData.postalCode?.replace(/\D/g, '') || '',
        addressNumber: paymentData.customerData.addressNumber || '',
        phone: paymentData.customerData.phone || ''
      };

      if (paymentData.installments && paymentData.installments > 1) {
        paymentPayload.installmentCount = paymentData.installments;
      }
    }

    console.log('Payload do pagamento:', JSON.stringify(paymentPayload, null, 2));

    // Criar cobrança no ASAAS
    const paymentResponse = await fetch('https://sandbox.asaas.com/api/v3/payments', {
      method: 'POST',
      headers: asaasHeaders,
      body: JSON.stringify(paymentPayload)
    });

    const paymentResult = await paymentResponse.json();
    console.log('Resposta criação pagamento:', JSON.stringify(paymentResult, null, 2));

    if (!paymentResponse.ok) {
      throw new Error(`Erro ao criar pagamento no ASAAS: ${JSON.stringify(paymentResult)}`);
    }

    // Salvar pedido no banco local
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        asaas_payment_id: paymentResult.id,
        total: paymentData.total,
        status: paymentResult.status || 'pending',
        payment_method: paymentData.paymentMethod,
        customer_name: paymentData.customerData.name,
        customer_email: paymentData.customerData.email,
        customer_phone: paymentData.customerData.phone,
        customer_address: paymentData.customerData,
        items: paymentData.items
      })
      .select()
      .single();

    if (orderError) {
      console.error('Erro ao salvar pedido:', orderError);
      throw new Error('Erro ao salvar pedido no banco de dados');
    }

    console.log('Pedido salvo com sucesso:', orderData);

    // Preparar resposta baseada no método de pagamento
    let responseData: any = {
      orderId: orderData.id,
      asaasPaymentId: paymentResult.id,
      status: paymentResult.status,
      total: paymentData.total,
      paymentMethod: paymentData.paymentMethod
    };

    if (paymentData.paymentMethod === 'PIX') {
      responseData.pixQrCode = paymentResult.pixQrCode;
      responseData.pixCopyAndPaste = paymentResult.pixCopyAndPaste;
      responseData.expirationDate = paymentResult.expirationDate;
    } else if (paymentData.paymentMethod === 'BOLETO') {
      responseData.boletoUrl = paymentResult.bankSlipUrl;
      responseData.barCode = paymentResult.barCode;
      responseData.dueDate = paymentResult.dueDate;
    } else if (paymentData.paymentMethod === 'CREDIT_CARD') {
      responseData.creditCardBrand = paymentResult.creditCard?.creditCardBrand;
      responseData.creditCardNumber = paymentResult.creditCard?.creditCardNumber;
    }

    console.log('=== PROCESS PAYMENT SUCCESS ===');

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== PROCESS PAYMENT ERROR ===');
    console.error('Error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});