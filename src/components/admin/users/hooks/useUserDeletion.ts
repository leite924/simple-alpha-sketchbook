
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
      
      // Buscar o perfil pelo email para obter o UUID
      const { data: profileData, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userToDelete.email)
        .single();
        
      if (searchError) {
        throw new Error(`Erro ao encontrar perfil: ${searchError.message}`);
      }
      
      // Excluir a função do usuário primeiro
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', profileData.id);
        
      if (roleError) throw roleError;
      
      // Excluir o usuário do Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileData.id);
      
      if (profileError) throw profileError;
      
      toast.success("Usuário excluído com sucesso!");
      return true;
    } catch (error: any) {
      console.error("Erro ao excluir usuário:", error);
      toast.error(`Erro: ${error.message}`);
      return false;
    }
  };

  return { deleteUser };
};
