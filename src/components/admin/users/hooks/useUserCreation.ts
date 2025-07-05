
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserFormValues } from "../types";

export const useUserCreation = () => {
  const createUser = async (values: UserFormValues): Promise<boolean> => {
    console.log("=== INÍCIO DA CRIAÇÃO DE USUÁRIO ===");
    console.log("Dados do usuário:", values);
    
    try {
      console.log("1. VERIFICAÇÃO CRÍTICA: Checando se email já existe...");
      
      // VERIFICAÇÃO RIGOROSA - Verificar se já existe nos perfis
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', values.email.toLowerCase().trim())
        .maybeSingle();
        
      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error("ERRO CRÍTICO ao verificar perfil existente:", profileCheckError);
        throw new Error(`Erro ao verificar usuário: ${profileCheckError.message}`);
      }
      
      if (existingProfile) {
        console.log("2. ❌ EMAIL JÁ CADASTRADO:", existingProfile);
        
        // Mensagens específicas para emails administrativos
        if (values.email.toLowerCase() === 'midiaputz@gmail.com') {
          toast.error("🚫 ERRO CRÍTICO: Este email já pertence ao Super Administrador do sistema!");
        } else if (values.email.toLowerCase() === 'elienaitorres@gmail.com') {
          toast.error("🚫 ERRO: Este email já pertence a um administrador do sistema!");
        } else {
          toast.error("⚠️ Este email já está cadastrado no sistema. Use outro email ou faça login.");
        }
        return false;
      }
      
      console.log("2. ✅ Email disponível, prosseguindo com criação...");
      
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
        email: values.email.toLowerCase().trim(),
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
        if (signupError.message.includes("User already registered") || signupError.message.includes("already registered")) {
          toast.error("🚫 Este email já está cadastrado no sistema de autenticação!");
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // IMPORTANTE: Determinar o role SEMPRE baseado no email primeiro
      let finalRole: "admin" | "instructor" | "student" | "super_admin" | "viewer" = "viewer";
      
      // VERIFICAÇÃO PRIORITÁRIA: Super Admin sempre pelo email
      if (values.email.toLowerCase() === 'midiaputz@gmail.com') {
        finalRole = 'super_admin';
        console.log("7. EMAIL SUPER ADMIN DETECTADO - Role definido como super_admin");
      } else if (values.email.toLowerCase() === 'elienaitorres@gmail.com') {
        finalRole = 'admin';
        console.log("7. EMAIL ADMIN ELIENAI DETECTADO - Role definido como admin");
      } else {
        // Usar a seleção do formulário, mas student tem prioridade para cadastros de aluno
        const roleMapping: Record<string, "admin" | "instructor" | "student" | "super_admin" | "viewer"> = {
          "admin": "admin",
          "viewer": "viewer", 
          "instructor": "instructor",
          "student": "student",
          "super_admin": "super_admin"
        };
        finalRole = roleMapping[values.role] || "student"; // DEFAULT para student em vez de viewer
        console.log("7. Role baseado na seleção do formulário:", finalRole);
      }
      
      console.log("8. Role final determinado:", finalRole);
      
      // EXCLUIR TODOS os roles existentes primeiro
      console.log("9. Removendo todos os roles existentes...");
      const { error: deleteAllRolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', signupData.user.id);
        
      if (deleteAllRolesError) {
        console.log("Aviso: Não foi possível excluir roles existentes:", deleteAllRolesError);
      } else {
        console.log("10. Todos os roles removidos com sucesso");
      }
      
      // Aguardar um pouco antes de inserir o novo role
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // INSERIR o role correto
      console.log("11. Inserindo o role correto:", finalRole);
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: signupData.user.id,
          role: finalRole
        });
        
      if (roleError) {
        console.error("Erro ao inserir role correto:", roleError);
        
        // Tentar novamente após uma pausa maior
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { error: retryRoleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: signupData.user.id,
            role: finalRole
          });
          
        if (retryRoleError) {
          console.error("Erro na segunda tentativa de inserir role:", retryRoleError);
          toast.error(`Usuário criado mas erro ao definir papel: ${retryRoleError.message}`);
          return false;
        } else {
          console.log("12. Role inserido com sucesso na segunda tentativa");
        }
      } else {
        console.log("12. Role correto inserido com sucesso na primeira tentativa");
      }
      
      console.log("13. Usuário criado com sucesso!");
      
      // Mensagens específicas baseadas no email
      if (values.email.toLowerCase() === 'midiaputz@gmail.com') {
        toast.success("⚡ SUPER ADMINISTRADOR criado com sucesso!");
      } else if (values.email.toLowerCase() === 'elienaitorres@gmail.com') {
        toast.success("👑 Administrador Elienai criado com sucesso!");
      } else {
        toast.success(`✅ Usuário criado com sucesso como ${finalRole}!`);
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
