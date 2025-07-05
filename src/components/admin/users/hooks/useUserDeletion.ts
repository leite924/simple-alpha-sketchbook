
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
      
      console.log('🗑️ Excluindo usuário:', userToDelete.email);
      
      // Usar a função administrativa para excluir usuário
      const { data, error } = await supabase.rpc('admin_delete_user_by_email', {
        user_email: userToDelete.email.toLowerCase().trim()
      });
      
      if (error) {
        console.error('❌ Erro ao excluir:', error);
        throw new Error(`Erro: ${error.message}`);
      }
      
      console.log('✅ Usuário excluído!');
      toast.success("Usuário excluído com sucesso!");
      return true;
      
    } catch (error: any) {
      console.error("❌ Erro:", error);
      toast.error(`Erro: ${error.message}`);
      return false;
    }
  };

  return { deleteUser };
};
