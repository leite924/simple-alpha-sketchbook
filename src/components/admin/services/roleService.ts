
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Assigns the default admin role to a user
 */
export const assignDefaultAdminRole = async (userId: string): Promise<boolean> => {
  try {
    console.log("Atribuindo papel de admin ao usuário");
    
    // Update or insert the admin role for the user
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'admin' // Assign admin role
      });
    
    if (roleError) {
      console.error("Erro ao atribuir função de administrador:", roleError);
      toast.error("Não foi possível definir papel de administrador");
      return false;
    }
    
    toast.success("Função de administrador atribuída com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao atribuir função de administrador:", error);
    toast.error("Erro ao definir papel de administrador");
    return false;
  }
};

/**
 * Assigns the highest admin role to the first user
 * Fixed to handle user_role as an enum type instead of text
 */
export const assignHighestAdminRole = async (userId: string): Promise<boolean> => {
  try {
    console.log("Nenhum papel existe, atribuindo papel de admin ao primeiro usuário");
    
    // Atualizar para super_admin
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'super_admin' // Atribui papel de super_admin
      });
    
    if (roleError) {
      console.error("Erro ao atribuir função de administrador:", roleError);
      toast.error("Não foi possível definir papel de administrador");
      return false;
    }
    
    toast.success("Função de administrador atribuída com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao atribuir função de administrador máximo:", error);
    toast.error("Erro ao definir papel de administrador");
    return false;
  }
};

/**
 * Check if a user has a specific role
 */
export const hasRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error("Erro ao verificar papel do usuário:", error);
      return false;
    }
    
    return data?.role === role;
  } catch (error) {
    console.error("Erro ao verificar papel do usuário:", error);
    return false;
  }
};
