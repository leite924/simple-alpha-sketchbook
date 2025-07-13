import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AsaasWebhookPayload {
  event: 'PAYMENT_RECEIVED' | 'PAYMENT_CONFIRMED' | 'PAYMENT_OVERDUE' | 'PAYMENT_DELETED' | 'PAYMENT_REFUNDED';
  payment: {
    id: string;
    customer: string;
    paymentLink?: string;
    value: number;
    netValue?: number;
    originalValue?: number;
    interestValue?: number;
    description?: string;
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'DEBIT_CARD';
    status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'REFUND_REQUESTED' | 'REFUND_IN_PROGRESS' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS';
    pixTransaction?: {
      qrCode: {
        id: string;
        payload: string;
        expirationDate: string;
      };
      endToEndIdentifier?: string;
    };
    dueDate: string;
    originalDueDate: string;
    paymentDate?: string;
    clientPaymentDate?: string;
    installmentNumber?: number;
    transactionReceiptUrl?: string;
    nossoNumero?: string;
    invoiceUrl?: string;
    bankSlipUrl?: string;
    invoiceNumber?: string;
    externalReference?: string;
    creditCard?: {
      creditCardNumber: string;
      creditCardBrand: string;
      creditCardToken: string;
    };
  };
}

// Status mapping ASAAS -> Local
const statusMapping = {
  'PENDING': 'pending',
  'RECEIVED': 'paid',
  'CONFIRMED': 'paid', 
  'OVERDUE': 'overdue',
  'REFUNDED': 'refunded',
  'RECEIVED_IN_CASH': 'paid',
  'REFUND_REQUESTED': 'refund_requested',
  'REFUND_IN_PROGRESS': 'refund_in_progress',
  'CHARGEBACK_REQUESTED': 'chargeback_requested',
  'CHARGEBACK_DISPUTE': 'chargeback_dispute',
  'AWAITING_CHARGEBACK_REVERSAL': 'awaiting_chargeback_reversal',
  'DUNNING_REQUESTED': 'dunning_requested',
  'DUNNING_RECEIVED': 'dunning_received',
  'AWAITING_RISK_ANALYSIS': 'awaiting_risk_analysis'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== ASAAS WEBHOOK START ===');
    console.log('Method:', req.method);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    // Parse do body
    const webhookData: AsaasWebhookPayload = await req.json();
    console.log('Webhook payload:', JSON.stringify(webhookData, null, 2));

    // Validar estrutura do webhook
    if (!webhookData.event || !webhookData.payment) {
      console.error('Payload do webhook inválido');
      return new Response('Invalid webhook payload', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Inicializar cliente Supabase com service role para bypassa RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { payment, event } = webhookData;

    // Buscar pedido pelo ID do pagamento ASAAS
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('asaas_payment_id', payment.id)
      .single();

    if (findError) {
      console.error('Erro ao buscar pedido:', findError);
      // Não retornamos erro para não causar reenvios desnecessários
      return new Response('Order not found', { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    if (!order) {
      console.warn('Pedido não encontrado para payment ID:', payment.id);
      return new Response('Order not found', { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    console.log('Pedido encontrado:', order.id);

    // Mapear status do ASAAS para status local
    const newStatus = statusMapping[payment.status] || payment.status.toLowerCase();
    
    // Preparar dados para atualização
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    // Adicionar informações específicas baseadas no evento
    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED':
        updateData.status = 'paid';
        if (payment.paymentDate) {
          updateData.paid_at = payment.paymentDate;
        }
        if (payment.netValue) {
          updateData.net_value = payment.netValue;
        }
        break;

      case 'PAYMENT_OVERDUE':
        updateData.status = 'overdue';
        break;

      case 'PAYMENT_REFUNDED':
        updateData.status = 'refunded';
        break;

      case 'PAYMENT_DELETED':
        updateData.status = 'cancelled';
        break;
    }

    console.log('Dados para atualização:', updateData);

    // Atualizar pedido no banco
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar pedido:', updateError);
      return new Response('Error updating order', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    console.log('Pedido atualizado com sucesso:', updatedOrder);

    // Log do evento para auditoria
    console.log(`Webhook processado: ${event} para pedido ${order.id} - Status: ${newStatus}`);

    // Aqui você pode adicionar lógica adicional como:
    // - Enviar email de confirmação
    // - Atualizar estoque
    // - Disparar notificações
    // - Integrar com outros sistemas

    console.log('=== ASAAS WEBHOOK SUCCESS ===');

    return new Response(JSON.stringify({ 
      success: true,
      orderId: order.id,
      newStatus: newStatus,
      event: event
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== ASAAS WEBHOOK ERROR ===');
    console.error('Error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Webhook processing failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});