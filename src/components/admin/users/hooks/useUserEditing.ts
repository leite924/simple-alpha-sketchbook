
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserFormValues, User } from "../types";

export const useUserEditing = () => {
  const editUser = async (currentUser: User, values: UserFormValues): Promise<boolean> => {
    console.log("Editando usuário:", values);
    
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
      
      // Se uma nova senha foi fornecida, atualizar a senha
      if (values.password && values.password.trim() !== '') {
        console.log("Atualizando senha do usuário");
        
        // Usar a API de administração do Supabase para atualizar a senha
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          existingProfile.id,
          { password: values.password }
        );
        
        if (passwordError) {
          console.error("Erro ao atualizar senha:", passwordError);
          throw new Error(`Erro ao atualizar senha: ${passwordError.message}`);
        }
        
        console.log("Senha atualizada com sucesso");
      }
      
      // Atualizar a função do usuário se necessário
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', existingProfile.id)
        .single();
        
      if (roleCheckError && roleCheckError.code !== 'PGRST116') {
        throw roleCheckError;
      }
      
      const dbRole = values.role === "viewer" ? "user" : values.role;
      
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
      
      toast.success("Usuário atualizado com sucesso!");
      return true;
    } catch (error: any) {
      console.error("Erro ao editar usuário:", error);
      toast.error(error.message || 'Erro inesperado ao editar usuário');
      return false;
    }
  };

  return { editUser };
};
