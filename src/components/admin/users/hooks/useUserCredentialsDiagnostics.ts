
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserCredentialsDiagnostics = () => {
  const checkUserCredentials = async (email: string) => {
    console.log("=== DIAGNÓSTICO DE CREDENCIAIS ===");
    console.log("📧 Email a verificar:", email);
    
    try {
      // 1. Verificar se o usuário existe na tabela auth.users via profiles
      console.log("1. Verificando se o usuário existe...");
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('email', email)
        .maybeSingle();
        
      if (profileError) {
        console.error("❌ Erro ao buscar perfil:", profileError);
        toast.error("Erro ao verificar usuário");
        return;
      }
      
      if (!profile) {
        console.log("❌ USUÁRIO NÃO ENCONTRADO no sistema");
        toast.error("Usuário não encontrado no sistema");
        return;
      }
      
      console.log("✅ Usuário encontrado:", {
        id: profile.id,
        email: profile.email,
        nome: `${profile.first_name} ${profile.last_name}`
      });
      
      // 2. Verificar role do usuário
      console.log("2. Verificando role do usuário...");
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', profile.id)
        .maybeSingle();
        
      if (roleError) {
        console.error("❌ Erro ao buscar role:", roleError);
      } else {
        const role = roleData?.role || 'SEM ROLE';
        console.log("🎭 Role do usuário:", role);
      }
      
      // 3. Tentar fazer login de teste (só para verificar se as credenciais estão corretas)
      console.log("3. IMPORTANTE: Teste de login manual necessário");
      console.log("📝 Para testar as credenciais, tente fazer login manualmente com:");
      console.log(`   Email: ${email}`);
      console.log(`   Senha: [a senha fornecida pelo usuário]`);
      console.log("");
      console.log("🔍 Possíveis causas de falha no login:");
      console.log("   - Senha incorreta");
      console.log("   - Email não confirmado");
      console.log("   - Usuário bloqueado");
      console.log("   - Problema na configuração do Supabase");
      
      // 4. Verificar configurações do projeto
      console.log("4. Verificações adicionais:");
      console.log("   - Verifique se o email está correto (sem espaços extras)");
      console.log("   - Confirme se a senha está correta");
      console.log("   - Verifique se o usuário confirmou o email");
      
      toast.success(`Usuário ${email} encontrado no sistema. Verifique o console para mais detalhes.`);
      
    } catch (error) {
      console.error("💥 Erro na verificação:", error);
      toast.error("Erro ao verificar credenciais");
    }
  };

  const resetUserPassword = async (email: string) => {
    console.log("🔑 Tentando resetar senha para:", email);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        console.error("❌ Erro ao resetar senha:", error);
        toast.error(`Erro ao resetar senha: ${error.message}`);
      } else {
        console.log("✅ Email de reset enviado");
        toast.success("Email de reset de senha enviado! Verifique a caixa de entrada.");
      }
    } catch (error) {
      console.error("💥 Erro no reset:", error);
      toast.error("Erro ao resetar senha");
    }
  };

  return { checkUserCredentials, resetUserPassword };
};
