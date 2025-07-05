
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProfileData {
  cpf?: string;
  phone?: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string | null;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  birth_date?: string;
}

/**
 * Creates a new user profile for public student registration
 */
export const createUser = async (
  email: string,
  firstName: string,
  lastName: string,
  profileData: ProfileData
): Promise<string | null> => {
  console.log('🎯 createUser: Iniciando cadastro público de estudante');
  console.log('📧 Email:', email);
  console.log('👤 Nome:', firstName, lastName);

  try {
    // VERIFICAÇÃO CRÍTICA: Checar se email já existe antes de tentar criar
    console.log("🔍 Verificando se email já existe:", email);
    
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();
      
    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      console.error("Erro ao verificar perfil existente:", profileCheckError);
      throw new Error('Erro ao verificar disponibilidade do email');
    }
    
    if (existingProfile) {
      console.log("❌ Email já cadastrado:", existingProfile);
      
      // Mensagens específicas para emails administrativos
      if (email.toLowerCase() === 'midiaputz@gmail.com') {
        throw new Error('🚫 ERRO CRÍTICO: Este email já pertence ao Super Administrador do sistema!');
      } else if (email.toLowerCase() === 'elienaitorres@gmail.com') {
        throw new Error('🚫 ERRO: Este email já pertence a um administrador do sistema!');
      } else {
        throw new Error('⚠️ Este email já está cadastrado. Faça login ou use outro email.');
      }
    }

    console.log("✅ Email disponível, prosseguindo com cadastro...");

    // Criar usuário via signup público
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password: 'TempPassword123!', // Senha temporária que deve ser alterada
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if (signupError) {
      console.error("Erro no signup:", signupError);
      if (signupError.message.includes("User already registered") || signupError.message.includes("already registered")) {
        throw new Error('🚫 Este email já está cadastrado no sistema de autenticação!');
      } else {
        throw new Error(`Erro ao criar usuário: ${signupError.message}`);
      }
    }

    if (!signupData.user) {
      throw new Error("Falha ao criar usuário");
    }

    console.log("✅ Usuário criado via signup com ID:", signupData.user.id);
    
    // Aguardar processamento do trigger
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Atualizar perfil com dados completos
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        cpf: profileData.cpf,
        phone: profileData.phone,
        address: profileData.address,
        address_number: profileData.addressNumber,
        address_complement: profileData.addressComplement,
        neighborhood: profileData.neighborhood,
        city: profileData.city,
        state: profileData.state,
        postal_code: profileData.postalCode,
        birth_date: profileData.birth_date
      })
      .eq('id', signupData.user.id);

    if (updateError) {
      console.error("Erro ao atualizar perfil:", updateError);
    }

    // CRITICAL: Garantir que o role seja STUDENT
    console.log("🎓 Definindo role como STUDENT para cadastro público");
    
    // Excluir todos os roles existentes
    const { error: deleteRolesError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', signupData.user.id);
      
    if (deleteRolesError) {
      console.log("Aviso: Não foi possível excluir roles existentes:", deleteRolesError);
    }
    
    // Inserir role de STUDENT
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: signupData.user.id,
        role: 'student' // SEMPRE student para cadastro público
      });
      
    if (roleError) {
      console.error("Erro ao inserir role de student:", roleError);
      
      // Tentar novamente
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { error: retryRoleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: signupData.user.id,
          role: 'student'
        });
        
      if (retryRoleError) {
        console.error("Erro na segunda tentativa:", retryRoleError);
        toast.error("Usuário criado mas erro ao definir como estudante");
      }
    }

    console.log("🎉 Estudante cadastrado com sucesso!");
    toast.success("✅ Estudante cadastrado com sucesso!");
    
    return signupData.user.id;
    
  } catch (error: any) {
    console.error("❌ Erro no createUser:", error);
    toast.error(error.message || 'Erro inesperado ao cadastrar estudante');
    throw error;
  }
};

/**
 * Creates a user profile via admin (maintains existing functionality)
 */
export const createUserAsAdmin = async (
  email: string,
  firstName: string,
  lastName: string,
  profileData: ProfileData
): Promise<string | null> => {
  console.log('🔐 createUserAsAdmin: Iniciando cadastro administrativo');
  
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      throw new Error('Você precisa estar logado como administrador');
    }

    console.log('👤 Admin logado:', currentUser.email);
    
    // Verificar se já existe
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();
    
    if (existingProfile) {
      console.log('📝 Atualizando perfil existente via admin');
      // Atualizar perfil existente
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          cpf: profileData.cpf,
          phone: profileData.phone,
          address: profileData.address,
          address_number: profileData.addressNumber,
          address_complement: profileData.addressComplement,
          neighborhood: profileData.neighborhood,
          city: profileData.city,
          state: profileData.state,
          postal_code: profileData.postalCode
        })
        .eq('id', existingProfile.id);
        
      if (updateError) {
        throw new Error(`Erro ao atualizar perfil: ${updateError.message}`);
      }
      
      return existingProfile.id;
    }
    
    // Criar novo perfil via função admin
    const userId = crypto.randomUUID();
    
    const { data: newUserId, error: createError } = await supabase
      .rpc('admin_create_student_profile', {
        p_admin_user_id: currentUser.id,
        p_id: userId,
        p_email: email.toLowerCase().trim(),
        p_first_name: firstName,
        p_last_name: lastName,
        p_cpf: profileData.cpf,
        p_phone: profileData.phone,
        p_address: profileData.address,
        p_address_number: profileData.addressNumber,
        p_address_complement: profileData.addressComplement,
        p_neighborhood: profileData.neighborhood,
        p_city: profileData.city,
        p_state: profileData.state,
        p_postal_code: profileData.postalCode
      });
    
    if (createError) {
      console.error('❌ Erro na função admin:', createError);
      throw new Error(`Erro ao criar perfil: ${createError.message}`);
    }
    
    // CRITICAL: Garantir que o role seja STUDENT para admin também
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'student' // SEMPRE student para cadastro de aluno
      });
      
    if (roleError) {
      console.error("Erro ao definir role de student:", roleError);
    }
    
    console.log('✅ Perfil criado via admin com sucesso');
    return newUserId || userId;
    
  } catch (error: any) {
    console.error('❌ Erro no createUserAsAdmin:', error);
    throw error;
  }
};
