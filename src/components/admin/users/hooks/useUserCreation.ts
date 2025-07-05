
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserFormValues } from "../types";

export const useUserCreation = () => {
  const createUser = async (values: UserFormValues): Promise<boolean> => {
    console.log("=== INÍCIO DA CRIAÇÃO DE USUÁRIO ===");
    console.log("Dados do usuário:", values);
    
    try {
      console.log("1. Verificando se usuário já existe nos perfis...");
      
      // Verificar se já existe nos perfis (método mais simples)
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', values.email)
        .maybeSingle();
        
      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error("Erro ao verificar perfil existente:", profileCheckError);
        throw new Error(`Erro ao verificar usuário: ${profileCheckError.message}`);
      }
      
      if (existingProfile) {
        console.log("2. Usuário já existe nos perfis:", existingProfile);
        toast.error("Usuário já existe no sistema");
        return false;
      }
      
      console.log("2. Usuário não existe, prosseguindo com criação via signup...");
      
      // Verificar permissões do usuário atual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.error("3. Nenhuma sessão ativa encontrada");
        throw new Error("Você precisa estar logado para criar usuários");
      }

      console.log("3. Sessão encontrada para usuário:", session.user.email);

      // Verificar se o usuário atual é super admin
      const isSuperAdmin = session.user.email === 'midiaputz@gmail.com';
      
      if (!isSuperAdmin) {
        const { data: currentUserRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        const canCreateUsers = currentUserRole?.role === 'super_admin' || currentUserRole?.role === 'admin';
        console.log("4. Usuário logado pode criar usuários?", canCreateUsers, "Role:", currentUserRole?.role);
        
        if (!canCreateUsers) {
          toast.error("Apenas administradores podem criar usuários");
          return false;
        }
      } else {
        console.log("4. Super admin detectado por email, pode criar usuários");
      }
      
      console.log("5. Criando usuário via signup público...");
      
      // Usar signup público em vez de admin.createUser
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.name.split(' ')[0],
            last_name: values.name.split(' ').slice(1).join(' ')
          }
        }
      });

      if (signupError) {
        console.error("Erro no signup:", signupError);
        if (signupError.message.includes("User already registered")) {
          toast.error("Este email já está cadastrado no sistema");
        } else {
          throw new Error(`Erro ao criar usuário: ${signupError.message}`);
        }
        return false;
      }

      if (!signupData.user) {
        throw new Error("Falha ao criar usuário");
      }

      console.log("6. Usuário criado via signup com ID:", signupData.user.id);
      
      // Aguardar um pouco para o trigger do perfil processar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determinar o role baseado no email e configuração
      let finalRole: "admin" | "instructor" | "student" | "super_admin" | "viewer" = "viewer";
      
      if (values.email === 'midiaputz@gmail.com') {
        finalRole = 'super_admin';
      } else if (values.email === 'elienaitorres@gmail.com') {
        finalRole = 'admin';
      } else {
        const roleMapping: Record<string, "admin" | "instructor" | "student" | "super_admin" | "viewer"> = {
          "admin": "admin",
          "viewer": "viewer", 
          "instructor": "instructor",
          "student": "student",
          "super_admin": "super_admin"
        };
        finalRole = roleMapping[values.role] || "viewer";
      }
      
      console.log("7. Atribuindo role:", finalRole);
      
      // Inserir role usando as permissões do super admin atual
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: signupData.user.id,
          role: finalRole
        });
        
      if (roleError) {
        console.error("Erro ao inserir role:", roleError);
        console.log("Role será inserido automaticamente pelo sistema");
      }
      
      console.log("8. Usuário criado com sucesso!");
      
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
