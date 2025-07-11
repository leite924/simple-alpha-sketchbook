
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verificar se é um POST request
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      })
    }

    // Obter dados do webhook
    const webhookData = await req.json()
    
    console.log('Webhook recebido:', JSON.stringify(webhookData, null, 2))

    // Extrair informações da transação
    const { id, current_status, amount, payment_method } = webhookData.data || {}
    
    if (!id) {
      console.error('ID da transação não encontrado no webhook')
      return new Response('Invalid webhook data', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Mapear status do Pagarme para nosso sistema
    const statusMapping: { [key: string]: string } = {
      'paid': 'paid',
      'pending': 'pending',
      'refused': 'refused',
      'refunded': 'refunded',
      'canceled': 'canceled',
      'processing': 'processing'
    }

    const mappedStatus = statusMapping[current_status] || current_status

    // Atualizar status da transação no banco
    const { data: updateData, error: updateError } = await supabase
      .from('payment_transactions')
      .update({ 
        status: mappedStatus,
        updated_at: new Date().toISOString()
      })
      .eq('pagarme_transaction_id', id)
      .select()

    if (updateError) {
      console.error('Erro ao atualizar transação:', updateError)
      return new Response('Database update failed', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    if (!updateData || updateData.length === 0) {
      console.log('Transação não encontrada no banco:', id)
      // Não é um erro, pode ser uma transação de outro sistema
      return new Response('Transaction not found', { 
        status: 404, 
        headers: corsHeaders 
      })
    }

    console.log('Transação atualizada com sucesso:', updateData[0])

    // Se o pagamento foi aprovado, fazer ações adicionais se necessário
    if (mappedStatus === 'paid') {
      console.log('Pagamento aprovado para transação:', id)
      
      // Aqui você pode adicionar lógica adicional como:
      // - Enviar email de confirmação
      // - Ativar acesso do usuário
      // - Gerar certificado
      // - etc.
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        transactionId: id,
        newStatus: mappedStatus
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )

  } catch (error) {
    console.error('Erro no webhook:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )
  }
})
