
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setShowConfirmationAlert: (show: boolean) => void;
  setErrorMessage: (message: string) => void;
}

const RegisterForm = ({ 
  email, 
  setEmail, 
  password, 
  setPassword,
  setShowConfirmationAlert,
  setErrorMessage
}: RegisterFormProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setShowConfirmationAlert(false);
    
    console.log("📝 === INÍCIO DO PROCESSO DE REGISTRO ===");
    console.log("📧 Email:", email);
    console.log("🔑 Senha fornecida:", password ? "***FORNECIDA***" : "VAZIA");
    console.log("⏰ Timestamp:", new Date().toISOString());
    
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });
      
      console.log("2️⃣ Resposta do registro:");
      console.log("   - Erro:", error);
      console.log("   - Dados:", data);
      console.log("   - User:", data?.user ? "PRESENTE" : "AUSENTE");
      console.log("   - Session:", data?.session ? "PRESENTE" : "AUSENTE");
      
      if (error) {
        console.error("❌ Erro de registro:", error);
        
        if (error.message.includes("User already registered")) {
          setErrorMessage("Este email já está cadastrado. Tente fazer login.");
          toast.error("Email já cadastrado");
        } else if (error.message.includes("Email provider is not enabled") || 
            error.message.includes("Email logins are disabled")) {
          setErrorMessage("O registro por email está desativado no Supabase. Ative-o nas configurações de autenticação.");
          toast.error("Registro por email desativado no Supabase");
        } else {
          setErrorMessage(`Erro ao criar conta: ${error.message}`);
          toast.error(`Erro ao criar conta: ${error.message}`);
        }
      } else {
        // Check if email confirmation is needed
        if (data?.user?.identities?.[0]?.identity_data?.email_verified === false && 
            data?.session === null) {
          // Email confirmation is required
          console.log("📧 Confirmação de email necessária");
          setShowConfirmationAlert(true);
          toast.success("Cadastro realizado! Verifique seu email para confirmar sua conta.");
        } else if (data?.session) {
          // No email confirmation needed, user is signed in
          console.log("✅ Registro realizado com sucesso, usuário logado");
          toast.success("Cadastro realizado com sucesso!");
          
          // Check if it's the super admin email
          if (email === 'midiaputz@gmail.com') {
            console.log("🔧 Super admin registrado, aguardando processamento...");
            toast.success("Super Admin registrado! Aguardando processamento...");
            
            setTimeout(() => {
              window.location.href = "/admin";
            }, 2000);
          } else {
            // Force navigation with replace to ensure clean redirect
            window.location.href = "/admin";
          }
        }
      }
    } catch (error: any) {
      console.error("💥 Erro completo no registro:", error);
      setErrorMessage(`Erro ao criar conta: ${error.message}`);
      toast.error(`Erro ao criar conta: ${error.message}`);
    } finally {
      setLoading(false);
      console.log("🏁 === FIM DO PROCESSO DE REGISTRO ===");
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Senha</Label>
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default RegisterForm;
