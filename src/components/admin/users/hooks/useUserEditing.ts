
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserFormValues, User } from "../types";

export const useUserEditing = () => {
  const editUser = async (currentUser: User, values: UserFormValues): Promise<boolean> => {
    console.log("Editando usuário:", values);
    console.log("Dados recebidos:", JSON.stringify(values, null, 2));
    
    try {
      // Buscar o perfil existente pelo email
      const { data: existingProfile, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', currentUser.email)
        .single();
        
      if (searchError) {
        console.error("Erro ao buscar perfil:", searchError);
        throw new Error(`Erro ao buscar perfil: ${searchError.message}`);
      }
      
      // Atualizar o perfil no Supabase usando o ID encontrado
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: values.name.split(' ')[0],
          last_name: values.name.split(' ').slice(1).join(' '),
        })
        .eq('id', existingProfile.id);
      
      if (profileError) throw profileError;
      
      // Verificar se é o email especial que deve ser super admin
      const isSpecialAdmin = values.email === 'midiaputz@gmail.com';
      
      // Atualizar a função do usuário se necessário
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', existingProfile.id)
        .single();
        
      if (roleCheckError && roleCheckError.code !== 'PGRST116') {
        throw roleCheckError;
      }
      
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
      
      if (!existingRole) {
        // Inserir nova função
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: existingProfile.id, 
            role: dbRole
          });
          
        if (insertError) throw insertError;
      } else if (existingRole.role !== dbRole) {
        console.log("Atualizando função de usuário para:", dbRole);
        
        // Atualizar função existente
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ 
            role: dbRole
          })
          .eq('user_id', existingProfile.id);
          
        if (updateError) {
          console.error("Erro ao atualizar função:", updateError);
          throw updateError;
        }
      }
      
      // Verificar se o usuário realmente pretende alterar a senha
      const intentToChangePassword = values.hasOwnProperty('password');
      
      console.log("Intent to change password?", intentToChangePassword);
      console.log("Values keys:", Object.keys(values));
      
      // Mostrar mensagem apropriada
      if (isSpecialAdmin) {
        toast.success("Super administrador atualizado com sucesso!");
      } else if (intentToChangePassword) {
        // Se há intenção de alterar senha, verificar se foi fornecida uma senha real
        const passwordProvided = values.password && 
                                values.password.trim() !== '' &&
                                !values.password.match(/^[•]+$/);
        
        console.log("Password provided?", passwordProvided);
        console.log("Password value:", values.password);
        
        if (passwordProvided) {
          toast.warning("Perfil atualizado, mas a senha não pôde ser alterada. Entre em contato com o administrador do sistema para alteração de senhas.");
        } else {
          toast.success("Usuário atualizado com sucesso!");
        }
      } else {
        // Usuário não quis alterar senha - sucesso simples
        toast.success("Usuário atualizado com sucesso!");
      }
      
      return true;
    } catch (error: any) {
      console.error("Erro ao editar usuário:", error);
      toast.error(error.message || 'Erro inesperado ao editar usuário');
      return false;
    }
  };

  return { editUser };
};
