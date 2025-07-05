
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Finds a user by their email address
 */
export async function findUserByEmail(email: string): Promise<string | undefined> {
  try {
    console.log('🔍 Procurando usuário por email:', email);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single() as { data: { id: string } | null, error: any };
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️ Usuário não encontrado (esperado para novo usuário)');
        return undefined;
      }
      console.error('❌ Erro ao buscar usuário por email:', error);
      return undefined;
    }
    
    console.log('✅ Usuário encontrado:', data?.id);
    return data?.id;
  } catch (error) {
    console.error('❌ Erro inesperado ao buscar usuário:', error);
    return undefined;
  }
}

/**
 * Creates a new user profile using the administrative function
 */
export async function createUserAsAdmin(
  email: string,
  firstName: string,
  lastName: string,
  profileData: {
    cpf?: string;
    birthDate?: string;
    phone?: string;
    address?: string;
    addressNumber?: string;
    addressComplement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }
): Promise<string | undefined> {
  try {
    console.log('🔐 Cadastrando aluno via função administrativa:', { email, firstName, lastName });
    console.log('📊 Profile data:', profileData);
    
    // Generate a UUID for the new profile
    const profileId = crypto.randomUUID();
    console.log('🆔 ID gerado para novo perfil:', profileId);
    
    // Validate required fields
    if (!email || !firstName) {
      console.error('❌ Campos obrigatórios faltando:', { email, firstName });
      throw new Error('Email e nome são obrigatórios');
    }
    
    // Use the administrative function to create or update the profile
    const { data, error } = await supabase.rpc('admin_create_student_profile', {
      p_id: profileId,
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
    
    if (error) {
      console.error('❌ Erro ao criar perfil via função administrativa:', error);
      console.error('🔍 Detalhes do erro:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Tratamento específico de erros
      if (error.message?.includes('Acesso negado')) {
        throw new Error('Você não tem permissão para cadastrar alunos. Verifique se está logado como administrador.');
      }
      
      if (error.code === '23505') {
        throw new Error('Este email já está cadastrado no sistema');
      }
      
      throw new Error(`Erro ao cadastrar aluno: ${error.message}`);
    }
    
    console.log('✅ Aluno cadastrado com sucesso via função administrativa:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Erro geral no cadastro administrativo:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro inesperado ao cadastrar aluno');
  }
}

/**
 * Creates a new user profile or updates existing user if found
 * This function is kept for backward compatibility and regular user signup
 */
export async function createUser(
  email: string,
  firstName: string,
  lastName: string,
  profileData: {
    cpf?: string;
    birthDate?: string;
    phone?: string;
    address?: string;
    addressNumber?: string;
    addressComplement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }
): Promise<string | undefined> {
  // Check if current user is admin, if so use admin function
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();
      
      if (userRole && ['admin', 'super_admin'].includes(userRole.role)) {
        console.log('🔐 Usuário é admin, usando função administrativa');
        return await createUserAsAdmin(email, firstName, lastName, profileData);
      }
    }
  } catch (error) {
    console.log('ℹ️ Não foi possível verificar role do usuário, continuando com método padrão');
  }

  // Fallback to original method for regular users
  return await createUserOriginal(email, firstName, lastName, profileData);
}

/**
 * Original createUser function for regular user signup
 */
async function createUserOriginal(
  email: string,
  firstName: string,
  lastName: string,
  profileData: {
    cpf?: string;
    birthDate?: string;
    phone?: string;
    address?: string;
    addressNumber?: string;
    addressComplement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }
): Promise<string | undefined> {
  try {
    console.log('🚀 Iniciando criação/atualização de usuário (método original):', { email, firstName, lastName });
    
    // First check if user already exists
    const existingUserId = await findUserByEmail(email);
    
    if (existingUserId) {
      console.log('⚠️ Usuário já existe, atualizando dados:', existingUserId);
      
      // Update existing user with new data
      const updateData: ProfileUpdate = {
        first_name: firstName?.trim() || null,
        last_name: lastName?.trim() || null,
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
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', existingUserId);

      if (updateError) {
        console.error('❌ Erro ao atualizar usuário existente:', updateError);
        throw new Error(`Erro ao atualizar dados do usuário: ${updateError.message}`);
      }

      console.log('✅ Dados do usuário atualizados com sucesso');
      return existingUserId;
    }
    
    // Generate a UUID for the new profile
    const profileId = crypto.randomUUID();
    console.log('🆔 ID gerado para novo perfil:', profileId);
    
    // Validate required fields
    if (!email || !firstName) {
      console.error('❌ Campos obrigatórios faltando:', { email, firstName });
      throw new Error('Email e nome são obrigatórios');
    }
    
    // Define the profile data with explicit typing
    const profileInsertData: ProfileInsert = {
      id: profileId,
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
    };
    
    console.log('📝 Dados para inserção:', profileInsertData);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileInsertData])
      .select('id')
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar perfil do usuário:', error);
      
      if (error.code === '23505') {
        throw new Error('Este email já está cadastrado no sistema');
      }
      
      if (error.message?.includes('row-level security')) {
        throw new Error('Erro de permissões - verifique se está autenticado como administrador');
      }
      
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
    
    console.log('✅ Usuário criado com sucesso:', data);
    return profileId;
    
  } catch (error) {
    console.error('❌ Erro geral na criação do usuário:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro inesperado ao criar usuário');
  }
}

/**
 * Retrieves a user profile by ID
 */
export async function getUserProfile(userId: string) {
  try {
    console.log('🔍 Buscando perfil do usuário:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single<Profile>();

    if (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      return null;
    }

    console.log('✅ Perfil encontrado:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro inesperado ao buscar perfil:', error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  profileData: {
    firstName?: string;
    lastName?: string;
    cpf?: string;
    birthDate?: string;
    phone?: string;
    address?: string;
    addressNumber?: string;
    addressComplement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }
) {
  try {
    console.log('🔄 Atualizando perfil:', userId, profileData);
    
    // Define update data with explicit typing to avoid complex type inference
    const updateData: ProfileUpdate = {
      first_name: profileData.firstName?.trim(),
      last_name: profileData.lastName?.trim(),
      cpf: profileData.cpf?.replace(/\D/g, ''),
      birth_date: profileData.birthDate,
      phone: profileData.phone,
      address: profileData.address?.trim(),
      address_number: profileData.addressNumber?.trim(),
      address_complement: profileData.addressComplement?.trim(),
      neighborhood: profileData.neighborhood?.trim(),
      city: profileData.city?.trim(),
      state: profileData.state?.trim().toUpperCase(),
      postal_code: profileData.postalCode?.replace(/\D/g, ''),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      return false;
    }

    console.log('✅ Perfil atualizado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro inesperado ao atualizar perfil:', error);
    return false;
  }
}
