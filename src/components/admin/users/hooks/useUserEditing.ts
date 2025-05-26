
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserFormValues, User } from "../types";

export const useUserEditing = () => {
  const editUser = async (currentUser: User, values: UserFormValues & { _changePassword?: boolean }): Promise<boolean> => {
    console.log("=== INÍCIO DO PROCESSO DE EDIÇÃO ===");
    console.log("Editando usuário:", values);
    console.log("Dados recebidos:", JSON.stringify(values, null, 2));
    console.log("Flag _changePassword:", values._changePassword);
    
    try {
      console.log("1. Buscando perfil existente...");
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
      
      console.log("2. Perfil encontrado:", existingProfile);
      
      console.log("3. Atualizando perfil no Supabase...");
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
      
      console.log("4. Perfil atualizado com sucesso");
      
      // Verificar se é o email especial que deve ser super admin
      const isSpecialAdmin = values.email === 'midiaputz@gmail.com';
      console.log("5. É super admin?", isSpecialAdmin);
      
      console.log("6. Verificando função do usuário...");
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
      
      console.log("7. Função existente:", existingRole);
      
      // Mapeamento de roles do frontend para roles do banco
      const roleMapping: Record<string, any> = {
        "admin": "admin",
        "viewer": "user",
        "instructor": "instructor",
        "student": "student",
        "super_admin": "super_admin"
      };
      
      // Se for o email especial, forçar super_admin, senão usar o role selecionado
      const dbRole = isSpecialAdmin ? "super_admin" : (roleMapping[values.role] || "user");
      console.log("8. Função a ser aplicada:", dbRole);
      
      if (!existingRole) {
        console.log("9. Inserindo nova função...");
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
        console.log("10. Nova função inserida com sucesso");
      } else if (existingRole.role !== dbRole) {
        console.log("11. Atualizando função existente para:", dbRole);
        
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
        console.log("12. Função atualizada com sucesso");
      } else {
        console.log("11. Função já está correta, nenhuma alteração necessária");
      }
      
      console.log("13. Definindo mensagem de sucesso...");
      // LÓGICA DE MENSAGENS
      if (isSpecialAdmin) {
        console.log("Exibindo mensagem para super admin");
        toast.success("Super administrador atualizado com sucesso!");
      } else if (values._changePassword === false || values._changePassword === undefined) {
        console.log("Usuário não quis alterar senha - sucesso simples");
        toast.success("Usuário atualizado com sucesso!");
      } else if (values._changePassword === true) {
        console.log("Usuário quis alterar senha - informando sobre limitação");
        toast.info("Perfil atualizado com sucesso! Nota: Para alterar senhas, o usuário deve usar a opção 'Esqueci minha senha' no login.");
      } else {
        console.log("Caso não previsto - usando sucesso padrão");
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
