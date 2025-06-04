
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePasswordReset = () => {
  const resetPasswordToDefault = async (email: string, newPassword: string = "123456") => {
    console.log("🔑 === RESETANDO SENHA ADMINISTRATIVA ===");
    console.log("📧 Email:", email);
    console.log("🔒 Nova senha:", newPassword);
    
    try {
      // 1. Buscar o usuário pelo email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
        
      if (profileError || !profile) {
        console.error("❌ Usuário não encontrado:", profileError);
        toast.error("Usuário não encontrado no sistema");
        return false;
      }
      
      console.log("✅ Usuário encontrado, ID:", profile.id);
      
      // 2. Usar a função admin do Supabase para alterar a senha
      const { error: passwordError } = await supabase.auth.admin.updateUserById(
        profile.id,
        { 
          password: newPassword,
          email_confirm: true // Também confirma o email se não estiver confirmado
        }
      );
      
      if (passwordError) {
        console.error("❌ Erro ao alterar senha:", passwordError);
        toast.error(`Erro ao alterar senha: ${passwordError.message}`);
        return false;
      }
      
      console.log("✅ Senha alterada com sucesso!");
      toast.success(`Senha do usuário ${email} alterada para: ${newPassword}`);
      
      return true;
      
    } catch (error: any) {
      console.error("💥 Erro no reset de senha:", error);
      toast.error("Erro ao resetar senha");
      return false;
    }
  };

  return { resetPasswordToDefault };
};
