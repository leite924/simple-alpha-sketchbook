
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setShowConfirmationAlert: (show: boolean) => void;
  setErrorMessage: (message: string) => void;
}

const LoginForm = ({ 
  email, 
  setEmail, 
  password, 
  setPassword,
  setShowConfirmationAlert,
  setErrorMessage
}: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setShowConfirmationAlert(false);
    
    console.log("🔐 === INÍCIO DO PROCESSO DE LOGIN (VERSÃO CORRIGIDA) ===");
    console.log("📧 Email:", email);
    console.log("🔑 Senha fornecida:", password ? "***FORNECIDA***" : "VAZIA");
    console.log("🌐 Supabase URL:", "https://iflrfdhbhezmzbmuikqp.supabase.co");
    console.log("⏰ Timestamp:", new Date().toISOString());
    
    try {
      console.log("1️⃣ Tentando fazer login com Supabase...");
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });
      
      console.log("2️⃣ Resposta do Supabase:");
      console.log("   - Erro:", error);
      console.log("   - Dados:", data);
      console.log("   - Session:", data?.session ? "PRESENTE" : "AUSENTE");
      console.log("   - User:", data?.user ? "PRESENTE" : "AUSENTE");
      
      if (error) {
        console.error("❌ Erro de login detalhado:");
        console.error("   - Código:", error.status);
        console.error("   - Mensagem:", error.message);
        console.error("   - Nome:", error.name);
        
        if (error.message.includes("Email not confirmed")) {
          console.log("📧 Email não confirmado");
          setShowConfirmationAlert(true);
          toast.error("É necessário confirmar o email antes de fazer login");
        } else if (error.message.includes("Invalid login credentials")) {
          console.log("🚫 Credenciais inválidas - tentando criar usuário...");
          
          // Se as credenciais são inválidas e é o email do super admin, tentar criar
          if (email === 'midiaputz@gmail.com') {
            console.log("🔧 Detectado email super admin, tentando criar usuário...");
            
            try {
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                  emailRedirectTo: `${window.location.origin}/admin`
                }
              });
              
              if (signUpError) {
                console.error("❌ Erro ao criar usuário:", signUpError);
                setErrorMessage(`Erro ao criar conta: ${signUpError.message}`);
                toast.error(`Erro ao criar conta: ${signUpError.message}`);
              } else if (signUpData.user) {
                console.log("✅ Usuário super admin criado com sucesso!");
                toast.success("Conta super admin criada! Aguarde processamento...");
                
                // Aguardar processamento do trigger
                setTimeout(() => {
                  console.log("🔄 Redirecionando para admin após criação...");
                  navigate("/admin", { replace: true });
                }, 2000);
              }
            } catch (createError: any) {
              console.error("💥 Erro ao tentar criar usuário:", createError);
              setErrorMessage(`Erro ao criar usuário: ${createError.message}`);
              toast.error(`Erro ao criar usuário: ${createError.message}`);
            }
          } else {
            setErrorMessage("Email ou senha incorretos. Verifique suas credenciais e tente novamente.");
            toast.error("Credenciais inválidas");
          }
        } else if (error.message.includes("Email link is invalid")) {
          console.log("🔗 Link de email inválido");
          setErrorMessage("Link de email inválido ou expirado.");
          toast.error("Link de email inválido");
        } else if (error.message.includes("User not found")) {
          console.log("👤 Usuário não encontrado");
          setErrorMessage("Usuário não encontrado. Verifique o email.");
          toast.error("Usuário não encontrado");
        } else {
          console.log("❓ Erro desconhecido");
          setErrorMessage(`Erro ao fazer login: ${error.message}`);
          toast.error(`Erro ao fazer login: ${error.message}`);
        }
      } else if (data.session) {
        console.log("✅ Login bem-sucedido!");
        console.log("   - Session ID:", data.session.access_token.substring(0, 20) + "...");
        console.log("   - User ID:", data.user?.id);
        console.log("   - User Email:", data.user?.email);
        
        toast.success("Login realizado com sucesso!");
        
        console.log("3️⃣ Redirecionando para /admin...");
        navigate("/admin", { replace: true });
      } else {
        console.log("⚠️ Login sem erro mas também sem session");
        setErrorMessage("Erro inesperado: login sem sessão");
        toast.error("Erro inesperado no login");
      }
    } catch (error: any) {
      console.error("💥 Erro completo no catch:");
      console.error("   - Tipo:", typeof error);
      console.error("   - Erro:", error);
      console.error("   - Stack:", error.stack);
      
      setErrorMessage(`Erro ao fazer login: ${error.message}`);
      toast.error(`Erro ao fazer login: ${error.message}`);
    } finally {
      setLoading(false);
      console.log("🏁 === FIM DO PROCESSO DE LOGIN ===");
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
