
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

    // Verificar se já existe usuário com este email
    const { data: existingProfiles, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .limit(1);
    
    if (checkError) {
      console.error('❌ Erro ao verificar perfil existente:', checkError);
      throw new Error(`Erro ao verificar perfil: ${checkError.message}`);
    }

    let resultUserId: string;

    if (existingProfiles && existingProfiles.length > 0) {
      // Usuário já existe, atualizar dados
      resultUserId = existingProfiles[0].id;
      console.log('ℹ️ Atualizando perfil existente:', resultUserId);
      
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName?.trim() || '',
          cpf: profileData.cpf?.replace(/\D/g, '') || null,
          birth_date: profileData.birthDate || null,
          phone: profileData.phone || null,
          address: profileData.address?.trim() || null,
          address_number: profileData.addressNumber?.trim() || null,
          address_complement: profileData.addressComplement?.trim() || null,
          neighborhood: profileData.neighborhood?.trim() || null,
          city: profileData.city?.trim() || null,
          state: profileData.state?.trim().toUpperCase() || null,
          postal_code: profileData.postalCode?.replace(/\D/g, '') || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', resultUserId);

      if (updateError) {
        console.error('❌ Erro ao atualizar perfil:', updateError);
        throw new Error(`Erro ao atualizar perfil: ${updateError.message}`);
      }

      console.log('✅ Perfil atualizado com sucesso');
    } else {
      // Criar novo usuário
      resultUserId = crypto.randomUUID();
      console.log('🆔 Criando novo perfil com ID:', resultUserId);
      
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: resultUserId,
          email: email.trim().toLowerCase(),
          first_name: firstName.trim(),
          last_name: lastName?.trim() || '',
          cpf: profileData.cpf?.replace(/\D/g, '') || null,
          birth_date: profileData.birthDate || null,
          phone: profileData.phone || null,
          address: profileData.address?.trim() || null,
          address_number: profileData.addressNumber?.trim() || null,
          address_complement: profileData.addressComplement?.trim() || null,
          neighborhood: profileData.neighborhood?.trim() || null,
          city: profileData.city?.trim() || null,
          state: profileData.state?.trim().toUpperCase() || null,
          postal_code: profileData.postalCode?.replace(/\D/g, '') || null
        });

      if (insertError) {
        console.error('❌ Erro ao criar perfil:', insertError);
        throw new Error(`Erro ao criar perfil: ${insertError.message}`);
      }

      console.log('✅ Perfil criado com sucesso');
    }

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
