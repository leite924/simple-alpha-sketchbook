
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserDiagnostics = () => {
  const checkUserConsistency = async () => {
    console.log("=== VERIFICAÇÃO DE CONSISTÊNCIA DE USUÁRIOS ===");
    
    try {
      // Buscar todos os perfis
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        return;
      }
      
      // Buscar todas as funções
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
        
      if (rolesError) {
        console.error("Erro ao buscar funções:", rolesError);
        return;
      }
      
      console.log("📋 RELATÓRIO DE USUÁRIOS APÓS LIMPEZA:");
      console.log("Perfis encontrados:", profiles?.length || 0);
      console.log("Funções encontradas:", roles?.length || 0);
      
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
        console.log("🧹 BASE DE DADOS LIMPA - Nenhum usuário encontrado");
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
      
      const message = profiles?.length === 0 
        ? "Base de dados limpa! Agora você pode criar os usuários corretamente."
        : `Encontrados ${profiles.length} usuários. Verifique o console para detalhes.`;
        
      toast.info(message);
      
    } catch (error) {
      console.error("Erro na verificação:", error);
      toast.error("Erro ao verificar consistência dos usuários");
    }
  };

  return { checkUserConsistency };
};
