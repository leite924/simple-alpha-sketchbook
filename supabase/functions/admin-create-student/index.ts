
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

    // Verificar se o usuário é admin usando o cliente admin
    const { data: userRole, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !userRole || !['admin', 'super_admin'].includes(userRole.role)) {
      console.error('❌ Permissão negada. Role:', userRole?.role);
      throw new Error('Acesso negado: apenas administradores podem cadastrar alunos');
    }

    console.log('✅ Usuário é admin/super_admin:', userRole.role);

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
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1);
    
    let userId: string;

    if (profiles && profiles.length > 0) {
      // Usuário já existe, usar ID existente
      userId = profiles[0].id;
      console.log('ℹ️ Usuário já existe:', userId);
    } else {
      // Gerar novo ID para o usuário
      userId = crypto.randomUUID();
      console.log('✅ Novo ID gerado:', userId);
    }

    // Usar a função administrativa para criar/atualizar o perfil
    const { data: profileId, error: createProfileError } = await supabaseAdmin.rpc('admin_create_student_profile', {
      p_id: userId,
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

    if (createProfileError) {
      console.error('❌ Erro ao criar/atualizar perfil:', createProfileError);
      throw new Error(`Erro ao processar perfil: ${createProfileError.message}`);
    }

    console.log('✅ Perfil criado/atualizado com sucesso:', profileId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId: profileId,
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
