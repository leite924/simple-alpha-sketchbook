
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserDiagnostics = () => {
  const checkUserConsistency = async () => {
    console.log("=== VERIFICAÇÃO DE CONSISTÊNCIA DE USUÁRIOS ===");
    
    try {
      // Buscar todos os perfis com roles
      const { data: profilesWithRoles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          created_at,
          user_roles(role)
        `);
        
      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        return;
      }
      
      console.log("📋 RELATÓRIO DE USUÁRIOS NO BANCO:");
      console.log("Perfis encontrados:", profilesWithRoles?.length || 0);
      
      if (profilesWithRoles && profilesWithRoles.length > 0) {
        console.log("\n👥 PERFIS DETALHADOS:");
        profilesWithRoles.forEach((profile, index) => {
          const userRole = Array.isArray(profile.user_roles) ? profile.user_roles[0] : profile.user_roles;
          console.log(`${index + 1}. ${profile.email}`);
          console.log(`   - Nome: ${profile.first_name} ${profile.last_name}`);
          console.log(`   - ID: ${profile.id}`);
          console.log(`   - Role: ${userRole?.role || 'SEM ROLE'}`);
          console.log(`   - Criado: ${profile.created_at}`);
          console.log("");
        });
      } else {
        console.log("🧹 NENHUM USUÁRIO ENCONTRADO NO BANCO");
      }
      
      // Verificar usuários específicos
      const elienaiBusca = profilesWithRoles?.find(p => p.email === 'elienaitorres@gmail.com');
      const midiaBusca = profilesWithRoles?.find(p => p.email === 'midiaputz@gmail.com');
      
      console.log("🔍 VERIFICAÇÕES ESPECÍFICAS:");
      console.log("Elienai existe?", elienaiBusca ? "SIM" : "NÃO");
      console.log("Midiaputz existe?", midiaBusca ? "SIM" : "NÃO");
      
      if (elienaiBusca) {
        const elienaiRole = Array.isArray(elienaiBusca.user_roles) ? elienaiBusca.user_roles[0] : elienaiBusca.user_roles;
        console.log("Role da Elienai:", elienaiRole?.role || "SEM ROLE");
      }
      
      if (midiaBusca) {
        const midiaRole = Array.isArray(midiaBusca.user_roles) ? midiaBusca.user_roles[0] : midiaBusca.user_roles;
        console.log("Role do Midiaputz:", midiaRole?.role || "SEM ROLE");
      }
      
      const message = (profilesWithRoles?.length || 0) === 0 
        ? "Nenhum usuário encontrado no banco de dados. Verifique se os perfis foram criados corretamente."
        : `Encontrados ${profilesWithRoles?.length} usuários no banco. Verifique o console para detalhes.`;
        
      toast.info(message);
      
    } catch (error) {
      console.error("Erro na verificação:", error);
      toast.error("Erro ao verificar consistência dos usuários");
    }
  };

  return { checkUserConsistency };
};
