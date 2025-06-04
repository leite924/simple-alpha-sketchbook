
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserDiagnostics = () => {
  const checkUserConsistency = async () => {
    console.log("=== VERIFICAÇÃO DE CONSISTÊNCIA DE USUÁRIOS ===");
    
    try {
      // Buscar todos os perfis
      console.log("1. Buscando todos os perfis...");
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        toast.error("Erro ao buscar perfis");
        return;
      }
      
      console.log("📋 PERFIS ENCONTRADOS:", profiles?.length || 0);
      
      // Buscar todas as roles
      console.log("2. Buscando todas as roles...");
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
        
      if (rolesError) {
        console.error("Erro ao buscar roles:", rolesError);
        toast.error("Erro ao buscar roles");
        return;
      }
      
      console.log("🎭 ROLES ENCONTRADAS:", roles?.length || 0);
      
      if (profiles && profiles.length > 0) {
        console.log("\n👥 PERFIS DETALHADOS:");
        profiles.forEach((profile, index) => {
          const userRole = roles?.find(r => r.user_id === profile.id);
          console.log(`${index + 1}. ${profile.email}`);
          console.log(`   - Nome: ${profile.first_name} ${profile.last_name}`);
          console.log(`   - ID: ${profile.id}`);
          console.log(`   - Role: ${userRole?.role || 'SEM ROLE'}`);
          console.log(`   - Criado: ${profile.created_at}`);
          console.log("");
        });
      } else {
        console.log("🧹 NENHUM PERFIL ENCONTRADO NO BANCO");
      }
      
      if (roles && roles.length > 0) {
        console.log("\n🎭 ROLES DETALHADAS:");
        roles.forEach((role, index) => {
          const profile = profiles?.find(p => p.id === role.user_id);
          console.log(`${index + 1}. User ID: ${role.user_id}`);
          console.log(`   - Role: ${role.role}`);
          console.log(`   - Email do perfil: ${profile?.email || 'PERFIL NÃO ENCONTRADO'}`);
          console.log("");
        });
      }
      
      // Verificar usuários específicos
      const elienaiBusca = profiles?.find(p => p.email === 'elienaitorres@gmail.com');
      const midiaBusca = profiles?.find(p => p.email === 'midiaputz@gmail.com');
      
      console.log("🔍 VERIFICAÇÕES ESPECÍFICAS:");
      console.log("Elienai existe?", elienaiBusca ? "SIM" : "NÃO");
      console.log("Midiaputz existe?", midiaBusca ? "SIM" : "NÃO");
      
      if (elienaiBusca) {
        const elienaiRole = roles?.find(r => r.user_id === elienaiBusca.id);
        console.log("Role da Elienai:", elienaiRole?.role || "SEM ROLE");
      }
      
      if (midiaBusca) {
        const midiaRole = roles?.find(r => r.user_id === midiaBusca.id);
        console.log("Role do Midiaputz:", midiaRole?.role || "SEM ROLE");
      }
      
      const totalUsers = profiles?.length || 0;
      const message = totalUsers === 0 
        ? "Nenhum usuário encontrado no banco de dados. Verifique se os perfis foram criados corretamente."
        : `Encontrados ${totalUsers} usuários no banco. Verifique o console para detalhes.`;
        
      toast.success(message);
      
    } catch (error) {
      console.error("Erro na verificação:", error);
      toast.error("Erro ao verificar consistência dos usuários");
    }
  };

  return { checkUserConsistency };
};
