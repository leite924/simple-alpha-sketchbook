
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePasswordReset = () => {
  const resetPasswordToDefault = async (email: string, newPassword: string = "123456") => {
    console.log("🔑 === RESET ADMINISTRATIVO DE SENHA (VERSÃO MELHORADA) ===");
    console.log("📧 Email:", email);
    console.log("🔒 Nova senha:", newPassword);
    
    try {
      // 1. Buscar o usuário pelo email na tabela profiles
      console.log("1️⃣ Buscando usuário por email...");
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('email', email.trim())
        .single();
        
      if (profileError || !profile) {
        console.error("❌ Usuário não encontrado:", profileError);
        toast.error("Usuário não encontrado no sistema");
        return false;
      }
      
      console.log("✅ Usuário encontrado:", {
        id: profile.id,
        email: profile.email,
        nome: `${profile.first_name} ${profile.last_name}`
      });
      
      // 2. Tentar fazer login de teste para verificar se o usuário existe no auth
      console.log("2️⃣ Testando se usuário existe no auth.users...");
      const { error: testError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: "senha_teste_inexistente_12345"
      });
      
      if (testError) {
        console.log("📝 Erro de teste (esperado):", testError.message);
        
        if (testError.message.includes("User not found") || testError.message.includes("Email not confirmed")) {
          console.error("❌ Usuário não existe no auth.users ou email não confirmado");
          toast.error("Usuário não existe na autenticação ou email não confirmado. Precisa recriar o usuário.");
          return false;
        }
      }
      
      // 3. Usar admin.updateUserById para alterar a senha
      console.log("3️⃣ Alterando senha via admin...");
      const { error: passwordError } = await supabase.auth.admin.updateUserById(
        profile.id,
        { 
          password: newPassword,
          email_confirm: true,
          user_metadata: {
            first_name: profile.first_name,
            last_name: profile.last_name
          }
        }
      );
      
      if (passwordError) {
        console.error("❌ Erro ao alterar senha:", passwordError);
        
        if (passwordError.message.includes("Unable to validate email address")) {
          console.error("💡 Problema: O usuário pode não existir no auth.users");
          toast.error("Erro: Usuário não existe na tabela de autenticação. Precisa recriar o usuário.");
          return false;
        }
        
        toast.error(`Erro ao alterar senha: ${passwordError.message}`);
        return false;
      }
      
      console.log("✅ Senha alterada com sucesso!");
      
      // 4. Fazer um teste de login para verificar se funcionou
      console.log("4️⃣ Testando login com nova senha...");
      const { error: loginTestError, data: loginData } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: newPassword
      });
      
      if (loginTestError) {
        console.error("❌ Teste de login falhou:", loginTestError);
        toast.error(`Senha foi alterada mas teste de login falhou: ${loginTestError.message}`);
        
        // Fazer logout para não afetar o usuário atual
        await supabase.auth.signOut();
        
        return false;
      } else {
        console.log("✅ Teste de login funcionou!");
        
        // Fazer logout para não afetar o usuário atual
        await supabase.auth.signOut();
        
        toast.success(`✅ Senha alterada com sucesso! Email: ${email} | Senha: ${newPassword}`);
        return true;
      }
      
    } catch (error: any) {
      console.error("💥 Erro no reset de senha:", error);
      toast.error(`Erro no reset de senha: ${error.message}`);
      return false;
    }
  };

  const createUserInAuth = async (email: string, password: string = "123456") => {
    console.log("👤 === CRIANDO USUÁRIO NO AUTH ===");
    console.log("📧 Email:", email);
    
    try {
      // Buscar dados do profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('email', email.trim())
        .single();
        
      if (profileError || !profile) {
        console.error("❌ Profile não encontrado");
        toast.error("Profile não encontrado no sistema");
        return false;
      }
      
      // Criar usuário no auth
      const { error: createError } = await supabase.auth.admin.createUser({
        email: email.trim(),
        password: password,
        email_confirm: true,
        user_metadata: {
          first_name: profile.first_name,
          last_name: profile.last_name
        }
      });
      
      if (createError) {
        console.error("❌ Erro ao criar usuário:", createError);
        toast.error(`Erro ao criar usuário: ${createError.message}`);
        return false;
      }
      
      console.log("✅ Usuário criado no auth com sucesso!");
      toast.success(`Usuário criado no auth! Email: ${email} | Senha: ${password}`);
      return true;
      
    } catch (error: any) {
      console.error("💥 Erro ao criar usuário:", error);
      toast.error(`Erro ao criar usuário: ${error.message}`);
      return false;
    }
  };

  return { resetPasswordToDefault, createUserInAuth };
};
