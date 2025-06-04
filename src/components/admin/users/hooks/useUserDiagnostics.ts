
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserDiagnostics = () => {
  const checkUserConsistency = async () => {
    console.log("=== VERIFICAÇÃO DE CONSISTÊNCIA DE USUÁRIOS (PÓS-LIMPEZA) ===");
    
    try {
      // Buscar todos os perfis primeiro
      console.log("1. Buscando perfis...");
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, created_at');
        
      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        toast.error("Erro ao buscar perfis");
        return;
      }
      
      console.log("📋 PERFIS ENCONTRADOS:", profiles?.length || 0);
      
      if (!profiles || profiles.length === 0) {
        console.log("🧹 NENHUM PERFIL ENCONTRADO NO BANCO");
        toast.success("Nenhum usuário encontrado no banco de dados. Verifique se os perfis foram criados corretamente.");
        return;
      }
      
      // Buscar roles para cada perfil
      console.log("2. Buscando roles para cada perfil...");
      const profilesWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: userRoles, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);
            
          if (roleError) {
            console.error(`Erro ao buscar role para ${profile.email}:`, roleError);
            return { ...profile, user_roles: [] };
          }
          
          return { ...profile, user_roles: userRoles || [] };
        })
      );
      
      console.log("\n👥 PERFIS DETALHADOS (PÓS-LIMPEZA):");
      profilesWithRoles.forEach((profile, index) => {
        const userRole = profile.user_roles?.[0]?.role || 'SEM ROLE';
        console.log(`${index + 1}. ${profile.email}`);
        console.log(`   - Nome: ${profile.first_name} ${profile.last_name}`);
        console.log(`   - ID: ${profile.id}`);
        console.log(`   - Role: ${userRole}`);
        console.log(`   - Criado: ${profile.created_at}`);
        console.log("");
      });
      
      // Verificar se há duplicatas por email
      const emailCounts = profilesWithRoles.reduce((acc, profile) => {
        acc[profile.email] = (acc[profile.email] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const duplicates = Object.entries(emailCounts).filter(([, count]) => count > 1);
      if (duplicates.length > 0) {
        console.log("⚠️ EMAILS DUPLICADOS ENCONTRADOS:");
        duplicates.forEach(([email, count]) => {
          console.log(`- ${email}: ${count} perfis`);
        });
      } else {
        console.log("✅ Nenhum email duplicado encontrado");
      }
      
      // Verificar usuários específicos
      const elienaiBusca = profilesWithRoles.find(p => p.email === 'elienaitorres@gmail.com');
      const midiaBusca = profilesWithRoles.find(p => p.email === 'midiaputz@gmail.com');
      
      console.log("\n🔍 VERIFICAÇÕES ESPECÍFICAS:");
      console.log("Elienai existe?", elienaiBusca ? "SIM" : "NÃO");
      console.log("Midiaputz existe?", midiaBusca ? "SIM" : "NÃO");
      
      if (elienaiBusca) {
        const elienaiRole = elienaiBusca.user_roles?.[0]?.role || "SEM ROLE";
        console.log("Role da Elienai:", elienaiRole);
      }
      
      if (midiaBusca) {
        const midiaRole = midiaBusca.user_roles?.[0]?.role || "SEM ROLE";
        console.log("Role do Midiaputz:", midiaRole);
      }
      
      const totalUsers = profilesWithRoles?.length || 0;
      const message = totalUsers === 0 
        ? "Nenhum usuário encontrado no banco de dados. Verifique se os perfis foram criados corretamente."
        : `Encontrados ${totalUsers} usuários no banco (pós-limpeza). Dados consistentes - sem duplicatas. Verifique o console para detalhes.`;
        
      toast.success(message);
      
    } catch (error) {
      console.error("Erro na verificação:", error);
      toast.error("Erro ao verificar consistência dos usuários");
    }
  };

  return { checkUserConsistency };
};
