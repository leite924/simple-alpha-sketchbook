
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserFormValues, User } from "../types";

export const useUserEditing = () => {
  const editUser = async (currentUser: User, values: UserFormValues & { _changePassword?: boolean }): Promise<boolean> => {
    console.log("=== INÍCIO DO PROCESSO DE EDIÇÃO ===");
    console.log("Editando usuário:", values);
    
    try {
      console.log("1. Verificando se o usuário logado é super admin...");
      // Verificar se o usuário atual é super admin
      const { data: { user: currentLoggedUser } } = await supabase.auth.getUser();
      
      if (!currentLoggedUser) {
        throw new Error("Usuário não autenticado");
      }

      const { data: currentUserRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentLoggedUser.id)
        .single();

      const isCurrentUserSuperAdmin = currentUserRole?.role === 'super_admin';
      console.log("2. Usuário logado é super admin?", isCurrentUserSuperAdmin);
      
      console.log("3. Buscando perfil existente...");
      // Buscar o perfil existente pelo email
      const { data: existingProfile, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', currentUser.email)
        .single();
        
      if (searchError) {
        console.error("ERRO ao buscar perfil:", searchError);
        throw new Error(`Erro ao buscar perfil: ${searchError.message}`);
      }
      
      console.log("4. Perfil encontrado:", existingProfile);
      
      console.log("5. Atualizando perfil no Supabase...");
      // Atualizar o perfil no Supabase usando o ID encontrado
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: values.name.split(' ')[0],
          last_name: values.name.split(' ').slice(1).join(' '),
        })
        .eq('id', existingProfile.id);
      
      if (profileError) {
        console.error("ERRO ao atualizar perfil:", profileError);
        throw profileError;
      }
      
      console.log("6. Perfil atualizado com sucesso");
      
      // Verificar se é um email especial que deve ter role específico
      const isElienai = values.email === 'elienaitorres@gmail.com';
      const isSuperAdmin = values.email === 'midiaputz@gmail.com';
      console.log("7. É Elienai (admin)?", isElienai, "É super admin?", isSuperAdmin);
      
      // Alterar senha se solicitado e se o usuário logado for super admin
      if (values._changePassword && values.password && isCurrentUserSuperAdmin) {
        console.log("8. Alterando senha (super admin)...");
        
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          existingProfile.id,
          { password: values.password }
        );
        
        if (passwordError) {
          console.error("ERRO ao alterar senha:", passwordError);
          // Não falha a operação toda, apenas informa o erro
          toast.error("Erro ao alterar senha. Verifique as permissões.");
        } else {
          console.log("9. Senha alterada com sucesso");
        }
      }
      
      console.log("10. Verificando função do usuário...");
      // Atualizar a função do usuário se necessário
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', existingProfile.id)
        .single();
        
      if (roleCheckError && roleCheckError.code !== 'PGRST116') {
        console.error("ERRO ao verificar função:", roleCheckError);
        throw roleCheckError;
      }
      
      console.log("11. Função existente:", existingRole);
      
      // Mapeamento de roles do frontend para roles do banco
      const roleMapping: Record<string, any> = {
        "admin": "admin",
        "viewer": "user",
        "instructor": "instructor",
        "student": "student",
        "super_admin": "super_admin"
      };
      
      // Determinar o role baseado nos emails especiais ou seleção
      let dbRole = roleMapping[values.role] || "user";
      if (isElienai) {
        dbRole = "admin";
      } else if (isSuperAdmin) {
        dbRole = "super_admin";
      }
      
      console.log("12. Função a ser aplicada:", dbRole);
      
      if (!existingRole) {
        console.log("13. Inserindo nova função...");
        // Inserir nova função
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: existingProfile.id, 
            role: dbRole
          });
          
        if (insertError) {
          console.error("ERRO ao inserir função:", insertError);
          throw insertError;
        }
        console.log("14. Nova função inserida com sucesso");
      } else if (existingRole.role !== dbRole) {
        console.log("15. Atualizando função existente para:", dbRole);
        
        // Atualizar função existente
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ 
            role: dbRole
          })
          .eq('user_id', existingProfile.id);
          
        if (updateError) {
          console.error("ERRO ao atualizar função:", updateError);
          throw updateError;
        }
        console.log("16. Função atualizada com sucesso");
      } else {
        console.log("15. Função já está correta, nenhuma alteração necessária");
      }
      
      console.log("17. Exibindo mensagem de sucesso...");
      
      // Mensagens mais inteligentes baseadas no contexto
      if (isSuperAdmin) {
        toast.success("Super administrador atualizado com sucesso!");
      } else if (isElienai) {
        toast.success("Administrador Elienai atualizado com sucesso!");
      } else if (values._changePassword && isCurrentUserSuperAdmin) {
        toast.success("Usuário e senha atualizados com sucesso!");
      } else if (values._changePassword && !isCurrentUserSuperAdmin) {
        toast.success("Perfil atualizado com sucesso! Nota: Apenas super administradores podem alterar senhas.");
      } else {
        toast.success("Usuário atualizado com sucesso!");
      }
      
      console.log("=== PROCESSO CONCLUÍDO COM SUCESSO ===");
      return true;
    } catch (error: any) {
      console.error("=== ERRO NO PROCESSO ===");
      console.error("Erro ao editar usuário:", error);
      toast.error(error.message || 'Erro inesperado ao editar usuário');
      return false;
    }
  };

  return { editUser };
};
