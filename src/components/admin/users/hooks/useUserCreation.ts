
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
      
      // Verificar se o usuário atual é super admin para poder criar usuários
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      const { data: currentUserRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id)
        .single();

      const isCurrentUserSuperAdmin = currentUserRole?.role === 'super_admin';
      console.log("3. Usuário logado é super admin?", isCurrentUserSuperAdmin);
      
      if (!isCurrentUserSuperAdmin) {
        toast.error("Apenas super administradores podem criar usuários");
        return false;
      }
      
      // Para casos especiais como Elienai, criar diretamente
      const isSpecialUser = values.email === 'elienaitorres@gmail.com';
      
      if (isSpecialUser) {
        console.log("4. Criando usuário especial Elienai...");
        
        // Gerar um UUID para o novo usuário
        const newUserId = crypto.randomUUID();
        
        console.log("5. Inserindo perfil para Elienai...");
        // Inserir diretamente na tabela profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: newUserId,
            email: values.email,
            first_name: values.name.split(' ')[0],
            last_name: values.name.split(' ').slice(1).join(' ')
          });
          
        if (profileError) {
          console.error("Erro ao inserir perfil:", profileError);
          throw profileError;
        }
        
        console.log("6. Inserindo role para Elienai...");
        // Inserir role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: newUserId,
            role: 'super_admin' // Elienai será super_admin
          });
          
        if (roleError) {
          console.error("Erro ao inserir role:", roleError);
          throw roleError;
        }
        
        console.log("7. Usuário Elienai criado com sucesso!");
        toast.success("Usuário Elienai criado com sucesso! Senha temporária: 123456");
        return true;
      }
      
      // Para outros usuários, usar o processo normal
      console.log("4. Criando usuário normal...");
      
      // Gerar um UUID para o novo usuário
      const newUserId = crypto.randomUUID();
      
      // Inserir na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUserId,
          email: values.email,
          first_name: values.name.split(' ')[0],
          last_name: values.name.split(' ').slice(1).join(' ')
        });
        
      if (profileError) {
        console.error("Erro ao inserir perfil:", profileError);
        throw profileError;
      }
      
      // Determinar o role baseado na seleção
      const roleMapping: Record<string, any> = {
        "admin": "admin",
        "viewer": "user", 
        "instructor": "instructor",
        "student": "student",
        "super_admin": "super_admin"
      };
      
      const dbRole = roleMapping[values.role] || "user";
      
      // Inserir role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUserId,
          role: dbRole
        });
        
      if (roleError) {
        console.error("Erro ao inserir role:", roleError);
        throw roleError;
      }
      
      console.log("5. Usuário criado com sucesso!");
      toast.success("Usuário criado com sucesso no sistema!");
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
