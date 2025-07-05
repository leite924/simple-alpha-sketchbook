
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserRestoration = () => {
  const restoreSuperAdmin = async (): Promise<boolean> => {
    console.log("=== INICIANDO RESTAURAÇÃO DO SUPER ADMIN ===");
    
    try {
      // 1. Buscar todos os perfis com o email do super admin
      console.log("1. Buscando perfis duplicados...");
      const { data: duplicateProfiles, error: searchError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('email', 'midiaputz@gmail.com');
        
      if (searchError) {
        console.error("Erro ao buscar perfis:", searchError);
        throw new Error(`Erro ao buscar perfis: ${searchError.message}`);
      }
      
      console.log("2. Perfis encontrados:", duplicateProfiles);
      
      if (!duplicateProfiles || duplicateProfiles.length === 0) {
        toast.error("Nenhum perfil encontrado com o email midiaputz@gmail.com");
        return false;
      }
      
      // 2. Pegar o usuário atual da sessão
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        toast.error("Você precisa estar logado para restaurar o super admin");
        return false;
      }
      
      console.log("3. Usuário atual da sessão:", currentUser.id, currentUser.email);
      
      // 3. Encontrar o perfil correto (o que corresponde ao usuário logado)
      let correctProfile = duplicateProfiles.find(profile => profile.id === currentUser.id);
      
      if (!correctProfile) {
        console.log("4. Perfil correto não encontrado, usando o primeiro disponível");
        correctProfile = duplicateProfiles[0];
      }
      
      console.log("5. Perfil correto identificado:", correctProfile);
      
      // 4. Remover TODOS os roles existentes para este email
      console.log("6. Removendo todos os roles existentes...");
      for (const profile of duplicateProfiles) {
        const { error: deleteRolesError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', profile.id);
          
        if (deleteRolesError) {
          console.log("Aviso ao remover roles:", deleteRolesError);
        }
      }
      
      // 5. Remover perfis duplicados (mantendo apenas o correto)
      console.log("7. Removendo perfis duplicados...");
      for (const profile of duplicateProfiles) {
        if (profile.id !== correctProfile.id) {
          console.log("Removendo perfil duplicado:", profile.id);
          const { error: deleteProfileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', profile.id);
            
          if (deleteProfileError) {
            console.log("Aviso ao remover perfil duplicado:", deleteProfileError);
          }
        }
      }
      
      // 6. Garantir que o perfil correto existe e está atualizado
      console.log("8. Atualizando perfil correto...");
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .upsert({
          id: correctProfile.id,
          email: 'midiaputz@gmail.com',
          first_name: 'Super',
          last_name: 'Admin'
        });
        
      if (updateProfileError) {
        console.error("Erro ao atualizar perfil:", updateProfileError);
        throw new Error(`Erro ao atualizar perfil: ${updateProfileError.message}`);
      }
      
      // 7. Inserir o role de super_admin para o perfil correto
      console.log("9. Inserindo role de super_admin...");
      const { error: insertRoleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: correctProfile.id,
          role: 'super_admin'
        });
        
      if (insertRoleError) {
        console.error("Erro ao inserir role:", insertRoleError);
        
        // Tentar novamente com upsert
        const { error: upsertRoleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: correctProfile.id,
            role: 'super_admin'
          });
          
        if (upsertRoleError) {
          throw new Error(`Erro ao inserir role: ${upsertRoleError.message}`);
        }
      }
      
      // 8. Garantir entrada na tabela super_admins
      console.log("10. Garantindo entrada na tabela super_admins...");
      const { error: superAdminError } = await supabase
        .from('super_admins')
        .upsert({
          user_id: correctProfile.id,
          email: 'midiaputz@gmail.com',
          is_active: true,
          permissions: {
            all: true,
            system_access: true,
            user_management: true,
            content_management: true
          }
        });
        
      if (superAdminError) {
        console.log("Aviso ao inserir super_admin:", superAdminError);
      }
      
      console.log("11. ✅ RESTAURAÇÃO CONCLUÍDA COM SUCESSO!");
      toast.success("🎉 Super Admin restaurado com sucesso! Sua conta está corrigida.");
      
      return true;
      
    } catch (error: any) {
      console.error("=== ERRO NA RESTAURAÇÃO ===");
      console.error("Erro:", error);
      toast.error(`Erro ao restaurar Super Admin: ${error.message}`);
      return false;
    }
  };

  return { restoreSuperAdmin };
};
