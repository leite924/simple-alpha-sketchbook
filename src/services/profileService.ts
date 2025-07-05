
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
 * Creates a new user profile or returns existing user ID if found
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
  try {
    console.log('🚀 Iniciando criação de usuário:', { email, firstName, lastName });
    console.log('📊 Profile data:', profileData);
    
    // First check if user already exists
    const existingUserId = await findUserByEmail(email);
    if (existingUserId) {
      console.log('⚠️ Usuário já existe:', existingUserId);
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
      console.error('🔍 Detalhes do erro:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Check for specific error types
      if (error.code === '23505') {
        console.error('❌ Erro de duplicação - usuário já existe');
        throw new Error('Este email já está cadastrado no sistema');
      }
      
      if (error.message?.includes('row-level security')) {
        console.error('❌ Erro de RLS - problema de permissões');
        throw new Error('Erro de permissões - verifique se está autenticado');
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

/**
 * Updates a user profile
 */
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
