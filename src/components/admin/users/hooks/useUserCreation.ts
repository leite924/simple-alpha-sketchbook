
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserFormValues } from "../types";

export const useUserCreation = () => {
  const createUser = async (values: UserFormValues): Promise<boolean> => {
    console.log("=== INÍCIO DA CRIAÇÃO DE USUÁRIO ===");
    console.log("Dados do usuário:", values);
    
    try {
      console.log("1. Verificando se usuário já existe...");
      
      // Primeiro, verificar se o usuário já existe nos perfis
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', values.email)
        .single();
        
      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error("Erro ao verificar perfil existente:", profileCheckError);
        throw new Error(`Erro ao verificar usuário: ${profileCheckError.message}`);
      }
      
      if (existingProfile) {
        console.log("2. Usuário já existe nos perfis:", existingProfile);
        toast.error("Usuário já existe no sistema");
        return false;
      }
      
      console.log("2. Usuário não existe, prosseguindo com criação...");
      
      // Verificar se o usuário atual é admin ou super admin para poder criar usuários
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.error("3. Nenhuma sessão ativa encontrada");
        throw new Error("Você precisa estar logado para criar usuários");
      }

      console.log("3. Sessão encontrada para usuário:", session.user.email);

      const { data: currentUserRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      const canCreateUsers = currentUserRole?.role === 'super_admin' || currentUserRole?.role === 'admin';
      console.log("4. Usuário logado pode criar usuários?", canCreateUsers, "Role:", currentUserRole?.role);
      
      if (!canCreateUsers) {
        toast.error("Apenas administradores podem criar usuários");
        return false;
      }
      
      console.log("5. Criando usuário no sistema de autenticação...");
      
      // Criar usuário no sistema de autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true, // Confirma o email automaticamente
        user_metadata: {
          first_name: values.name.split(' ')[0],
          last_name: values.name.split(' ').slice(1).join(' ')
        }
      });

      if (authError) {
        console.error("Erro ao criar usuário na autenticação:", authError);
        throw new Error(`Erro ao criar usuário: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error("Falha ao criar usuário no sistema de autenticação");
      }

      console.log("6. Usuário criado na autenticação com ID:", authData.user.id);
      
      console.log("7. Inserindo perfil...");
      // Inserir diretamente na tabela profiles com o ID do usuário criado
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: values.email,
          first_name: values.name.split(' ')[0],
          last_name: values.name.split(' ').slice(1).join(' ')
        });
        
      if (profileError) {
        console.error("Erro ao inserir perfil:", profileError);
        // Se falhar ao criar o perfil, excluir o usuário da autenticação
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }
      
      // Determinar o role baseado na seleção ou email especial
      const roleMapping: Record<string, any> = {
        "admin": "admin",
        "viewer": "user", 
        "instructor": "instructor",
        "student": "student",
        "super_admin": "super_admin"
      };
      
      // Tratamento especial para emails específicos
      let finalRole = roleMapping[values.role] || "user";
      if (values.email === 'elienaitorres@gmail.com') {
        finalRole = 'admin';
      } else if (values.email === 'midiaputz@gmail.com') {
        finalRole = 'super_admin';
      }
      
      console.log("8. Inserindo role:", finalRole);
      // Inserir role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: finalRole
        });
        
      if (roleError) {
        console.error("Erro ao inserir role:", roleError);
        // Se falhar ao criar o role, excluir o usuário e perfil
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw roleError;
      }
      
      console.log("9. Usuário criado com sucesso!");
      
      if (values.email === 'elienaitorres@gmail.com') {
        toast.success("Usuário Elienai criado como admin com sucesso!");
      } else if (values.email === 'midiaputz@gmail.com') {
        toast.success("Super Admin criado com sucesso!");
      } else {
        toast.success("Usuário criado com sucesso no sistema!");
      }
      
      return true;
      
    } catch (error: any) {
      console.error("=== ERRO NA CRIAÇÃO ===");
      console.error("Erro ao criar usuário:", error);
      toast.error(error.message || 'Erro inesperado ao criar usuário');
      return false;
    }
  };

  return { createUser };
};
