
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔐 Admin Create Student: Iniciando função');
    
    // Criar cliente Supabase com service role (admin)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('❌ Authorization header missing');
      throw new Error('Authorization header is required');
    }

    // Obter usuário do token JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('❌ Auth error:', authError);
      throw new Error('Invalid authentication token');
    }

    console.log('✅ Usuário autenticado:', user.email);

    // Processar dados do request
    const requestData = await req.json();
    console.log('📝 Dados recebidos:', requestData);

    const {
      email,
      firstName,
      lastName,
      profileData
    } = requestData;

    if (!email || !firstName) {
      throw new Error('Email e nome são obrigatórios');
    }

    // Gerar ID para o novo perfil
    const newProfileId = crypto.randomUUID();
    console.log('🆔 Novo ID gerado:', newProfileId);

    // Chamar a função SQL que existe, passando o ID do admin autenticado
    const { data: resultUserId, error: functionError } = await supabaseAdmin
      .rpc('admin_create_student_profile', {
        p_admin_user_id: user.id, // ID do admin autenticado
        p_id: newProfileId,
        p_email: email.trim().toLowerCase(),
        p_first_name: firstName.trim(),
        p_last_name: lastName?.trim() || '',
        p_cpf: profileData.cpf?.replace(/\D/g, '') || null,
        p_birth_date: profileData.birthDate || null,
        p_phone: profileData.phone || null,
        p_address: profileData.address?.trim() || null,
        p_address_number: profileData.addressNumber?.trim() || null,
        p_address_complement: profileData.addressComplement?.trim() || null,
        p_neighborhood: profileData.neighborhood?.trim() || null,
        p_city: profileData.city?.trim() || null,
        p_state: profileData.state?.trim().toUpperCase() || null,
        p_postal_code: profileData.postalCode?.replace(/\D/g, '') || null
      });

    if (functionError) {
      console.error('❌ Erro na função SQL:', functionError);
      throw new Error(`Erro ao processar perfil: ${functionError.message}`);
    }

    console.log('✅ Função SQL executada com sucesso. ID retornado:', resultUserId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId: resultUserId,
        message: 'Aluno cadastrado com sucesso'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('❌ Erro na função admin-create-student:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        success: false
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})
