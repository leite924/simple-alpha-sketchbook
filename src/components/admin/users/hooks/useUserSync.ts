
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserSync = () => {
  const syncAllUsers = async (): Promise<boolean> => {
    console.log("=== SINCRONIZAÇÃO USANDO APENAS BANCO DE DADOS ===");
    
    try {
      // Verificar usuários que existem nos perfis mas não têm role
      console.log("1. Verificando usuários sem role...");
      
      const { data: profilesWithoutRoles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          user_roles(role)
        `)
        .is('user_roles.role', null);
        
      if (profilesError) {
        console.error("Erro ao buscar perfis sem roles:", profilesError);
        throw profilesError;
      }
      
      console.log("2. Perfis sem roles encontrados:", profilesWithoutRoles?.length || 0);
      
      // Atribuir roles para usuários que não têm
      for (const profile of profilesWithoutRoles || []) {
        console.log(`3. Atribuindo role para ${profile.email}`);
        
        let role: "admin" | "instructor" | "student" | "super_admin" | "user" = 'user';
        if (profile.email === 'midiaputz@gmail.com') {
          role = 'super_admin';
        } else if (profile.email === 'elienaitorres@gmail.com') {
          role = 'admin';
        }
        
        const { error: createRoleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: profile.id,
            role: role
          });
          
        if (createRoleError) {
          console.error(`Erro ao criar role para ${profile.email}:`, createRoleError);
        } else {
          console.log(`✅ Role ${role} criada para ${profile.email}`);
        }
      }
      
      console.log("=== SINCRONIZAÇÃO CONCLUÍDA ===");
      toast.success(`Sincronização concluída! ${profilesWithoutRoles?.length || 0} usuários processados.`);
      return true;
      
    } catch (error: any) {
      console.error("=== ERRO NA SINCRONIZAÇÃO ===", error);
      toast.error(`Erro na sincronização: ${error.message}`);
      return false;
    }
  };

  const cleanOrphanedProfiles = async (): Promise<boolean> => {
    console.log("=== VERIFICANDO CONSISTÊNCIA DO BANCO ===");
    
    try {
      // Verificar se há roles órfãos
      const { data: orphanedRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles(email)
        `)
        .is('profiles.email', null);
        
      if (rolesError) throw rolesError;
      
      console.log("Roles órfãos encontrados:", orphanedRoles?.length || 0);
      
      for (const orphanedRole of orphanedRoles || []) {
        console.log(`Removendo role órfão: ${orphanedRole.user_id}`);
        
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', orphanedRole.user_id);
      }
      
      if ((orphanedRoles?.length || 0) > 0) {
        toast.success(`${orphanedRoles?.length} roles órfãos removidos`);
      } else {
        toast.info("Banco de dados consistente - nenhuma limpeza necessária");
      }
      
      return true;
      
    } catch (error: any) {
      console.error("Erro ao verificar consistência:", error);
      toast.error(`Erro ao verificar consistência: ${error.message}`);
      return false;
    }
  };

  return { syncAllUsers, cleanOrphanedProfiles };
};
