
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserSync = () => {
  const syncAllUsers = async (): Promise<boolean> => {
    console.log("=== INÍCIO DA SINCRONIZAÇÃO COMPLETA ===");
    
    try {
      // 1. Buscar todos os usuários da autenticação do Supabase
      console.log("1. Buscando usuários do auth.users...");
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Erro ao buscar usuários da autenticação:", authError);
        throw authError;
      }
      
      console.log("2. Usuários encontrados no auth:", authUsers.users.length);
      
      // 2. Buscar todos os perfis existentes
      const { data: existingProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email');
        
      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        throw profilesError;
      }
      
      console.log("3. Perfis existentes:", existingProfiles?.length || 0);
      
      // 3. Buscar todas as funções existentes
      const { data: existingRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
        
      if (rolesError) {
        console.error("Erro ao buscar funções:", rolesError);
        throw rolesError;
      }
      
      console.log("4. Funções existentes:", existingRoles?.length || 0);
      
      // 4. Sincronizar cada usuário
      for (const authUser of authUsers.users) {
        console.log(`5. Processando usuário: ${authUser.email}`);
        
        // Verificar se o perfil existe
        const profileExists = existingProfiles?.find(p => p.id === authUser.id);
        
        if (!profileExists) {
          console.log(`6. Criando perfil para ${authUser.email}`);
          
          // Criar perfil
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: authUser.id,
              email: authUser.email,
              first_name: authUser.user_metadata?.first_name || authUser.email?.split('@')[0] || 'Usuário',
              last_name: authUser.user_metadata?.last_name || ''
            });
            
          if (createProfileError) {
            console.error(`Erro ao criar perfil para ${authUser.email}:`, createProfileError);
          } else {
            console.log(`✅ Perfil criado para ${authUser.email}`);
          }
        } else {
          console.log(`✅ Perfil já existe para ${authUser.email}`);
        }
        
        // Verificar se a função existe
        const roleExists = existingRoles?.find(r => r.user_id === authUser.id);
        
        if (!roleExists) {
          console.log(`7. Criando função para ${authUser.email}`);
          
          // Determinar a função baseada no email
          let role: "admin" | "instructor" | "student" | "super_admin" | "user" = 'user';
          if (authUser.email === 'midiaputz@gmail.com') {
            role = 'super_admin';
          } else if (authUser.email === 'elienaitorres@gmail.com') {
            role = 'admin';
          }
          
          // Criar função
          const { error: createRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authUser.id,
              role: role
            });
            
          if (createRoleError) {
            console.error(`Erro ao criar função para ${authUser.email}:`, createRoleError);
          } else {
            console.log(`✅ Função ${role} criada para ${authUser.email}`);
          }
        } else {
          console.log(`✅ Função já existe para ${authUser.email}: ${roleExists.role}`);
        }
      }
      
      console.log("=== SINCRONIZAÇÃO CONCLUÍDA ===");
      toast.success(`Sincronização concluída! ${authUsers.users.length} usuários processados.`);
      return true;
      
    } catch (error: any) {
      console.error("=== ERRO NA SINCRONIZAÇÃO ===", error);
      toast.error(`Erro na sincronização: ${error.message}`);
      return false;
    }
  };

  const cleanOrphanedProfiles = async (): Promise<boolean> => {
    console.log("=== LIMPANDO PERFIS ÓRFÃOS ===");
    
    try {
      // Buscar perfis que não têm usuário correspondente na autenticação
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email');
        
      if (profilesError) throw profilesError;
      
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;
      
      const authUserIds = authUsers.users.map(u => u.id);
      const orphanedProfiles = profiles?.filter(p => !authUserIds.includes(p.id)) || [];
      
      console.log("Perfis órfãos encontrados:", orphanedProfiles.length);
      
      for (const profile of orphanedProfiles) {
        console.log(`Removendo perfil órfão: ${profile.email}`);
        
        // Remover função primeiro
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', profile.id);
          
        // Remover perfil
        await supabase
          .from('profiles')
          .delete()
          .eq('id', profile.id);
      }
      
      if (orphanedProfiles.length > 0) {
        toast.success(`${orphanedProfiles.length} perfis órfãos removidos`);
      }
      
      return true;
      
    } catch (error: any) {
      console.error("Erro ao limpar perfis órfãos:", error);
      toast.error(`Erro ao limpar perfis órfãos: ${error.message}`);
      return false;
    }
  };

  return { syncAllUsers, cleanOrphanedProfiles };
};
