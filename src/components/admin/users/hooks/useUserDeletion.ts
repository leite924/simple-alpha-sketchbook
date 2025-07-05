
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "../types";

export const useUserDeletion = () => {
  const deleteUser = async (userId: number, users: User[]): Promise<boolean> => {
    try {
      const userToDelete = users.find(u => u.id === userId);
      if (!userToDelete) {
        throw new Error("Usuário não encontrado");
      }
      
      console.log('🗑️ Iniciando exclusão do usuário:', userToDelete.email);
      
      // Buscar o perfil pelo email para obter o UUID
      const { data: profileData, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userToDelete.email)
        .single();
        
      if (searchError) {
        console.error('❌ Erro ao encontrar perfil:', searchError);
        throw new Error(`Erro ao encontrar perfil: ${searchError.message}`);
      }
      
      console.log('👤 Perfil encontrado, UUID:', profileData.id);
      
      // 1. Primeiro, excluir todas as funções do usuário
      console.log('🔧 Removendo funções do usuário...');
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', profileData.id);
        
      if (roleError) {
        console.error('❌ Erro ao remover funções:', roleError);
        // Continuar mesmo se houver erro nas funções
      } else {
        console.log('✅ Funções removidas com sucesso');
      }
      
      // 2. Depois, excluir o perfil do usuário
      console.log('👤 Removendo perfil do usuário...');
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileData.id);
      
      if (profileError) {
        console.error('❌ Erro ao excluir perfil:', profileError);
        throw new Error(`Erro ao excluir perfil: ${profileError.message}`);
      }
      
      console.log('✅ Usuário excluído com sucesso!');
      toast.success("Usuário excluído com sucesso!");
      return true;
      
    } catch (error: any) {
      console.error("❌ Erro ao excluir usuário:", error);
      toast.error(`Erro: ${error.message}`);
      return false;
    }
  };

  return { deleteUser };
};
