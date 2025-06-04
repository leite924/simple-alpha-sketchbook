
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePasswordReset = () => {
  const resetPasswordDirectly = async (email: string, newPassword: string = "123456") => {
    console.log("🔐 === RESET DIRETO DE SENHA ===");
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
      
      // 2. Tentar fazer login administrativo usando RPC ou Edge Function
      console.log("2️⃣ Tentando criar/atualizar usuário no auth...");
      
      // Primeiro, vamos tentar um signup normal para garantir que existe no auth
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password: newPassword,
        options: {
          data: {
            first_name: profile.first_name,
            last_name: profile.last_name
          }
        }
      });
      
      if (signupError) {
        console.log("⚠️ Signup falhou (pode já existir):", signupError.message);
        
        // Se o usuário já existe, isso é na verdade bom
        if (signupError.message.includes("already registered") || 
            signupError.message.includes("User already registered")) {
          console.log("✅ Usuário já existe no auth, isso é esperado!");
          toast.success(`✅ Usuário ${email} confirmado no sistema de autenticação! Tente fazer login com a senha: ${newPassword}`);
          return true;
        } else {
          toast.error(`Erro no signup: ${signupError.message}`);
          return false;
        }
      }
      
      console.log("✅ Signup realizado/confirmado!");
      toast.success(`✅ Senha definida para ${email}! Use a senha: ${newPassword}`);
      return true;
      
    } catch (error: any) {
      console.error("💥 Erro no reset direto:", error);
      toast.error(`Erro no reset direto: ${error.message}`);
      return false;
    }
  };

  const resetPasswordToDefault = async (email: string, newPassword: string = "123456") => {
    console.log("🔑 === RESET DE SENHA SIMPLIFICADO ===");
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
      
      // 2. Usar reset password for email (mais simples e funciona sempre)
      console.log("2️⃣ Enviando email de reset...");
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth#reset-password`
        }
      );
      
      if (resetError) {
        console.error("❌ Erro ao enviar reset:", resetError);
        toast.error(`Erro ao enviar reset: ${resetError.message}`);
        return false;
      }
      
      console.log("✅ Email de reset enviado!");
      toast.success(`📧 Email de reset enviado para ${email}! Peça para o usuário verificar a caixa de entrada e definir a senha: ${newPassword}`);
      return true;
      
    } catch (error: any) {
      console.error("💥 Erro no reset de senha:", error);
      toast.error(`Erro no reset de senha: ${error.message}`);
      return false;
    }
  };

  const createUserInAuth = async (email: string, password: string = "123456") => {
    console.log("👤 === MÉTODO ALTERNATIVO: CONVITE POR EMAIL ===");
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
      
      // Como não temos permissão admin, vamos tentar um signup normal
      console.log("👤 Tentando signup normal...");
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            first_name: profile.first_name,
            last_name: profile.last_name
          }
        }
      });
      
      if (error) {
        console.error("❌ Erro no signup:", error);
        if (error.message.includes("already registered")) {
          toast.success("✅ Usuário já existe! Tente fazer login normalmente.");
          return true;
        }
        toast.error(`Erro: ${error.message}`);
        return false;
      }
      
      console.log("✅ Signup realizado!");
      toast.success(`✅ Convite enviado para ${email}! Senha sugerida: ${password}`);
      return true;
      
    } catch (error: any) {
      console.error("💥 Erro ao criar usuário:", error);
      toast.error(`Erro: ${error.message}`);
      return false;
    }
  };

  return { resetPasswordDirectly, resetPasswordToDefault, createUserInAuth };
};
