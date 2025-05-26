
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
    
    try {
      console.log("Attempting login with:", email);
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        
        if (error.message.includes("Email not confirmed") || 
            (error.status === 400 && error.code === "email_not_confirmed")) {
          setShowConfirmationAlert(true);
          setErrorMessage("");
          toast.error("É necessário confirmar o email antes de fazer login");
        } else if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Email ou senha incorretos. Verifique suas credenciais e tente novamente.");
          toast.error("Credenciais inválidas");
        } else if (error.message.includes("Email provider is not enabled") || 
                  error.message.includes("Email logins are disabled")) {
          setErrorMessage("O login por email está desativado no Supabase. Ative-o nas configurações de autenticação.");
          toast.error("Login por email desativado no Supabase");
        } else {
          setErrorMessage(`Erro ao fazer login: ${error.message}`);
          toast.error(`Erro ao fazer login: ${error.message}`);
        }
      } else if (data.session) {
        console.log("Login successful, session:", data.session);
        toast.success("Login realizado com sucesso!");
        
        // Use navigate instead of window.location.href to avoid page reload
        navigate("/admin", { replace: true });
      }
    } catch (error: any) {
      console.error("Erro completo:", error);
      setErrorMessage(`Erro ao fazer login: ${error.message}`);
      toast.error(`Erro ao fazer login: ${error.message}`);
    } finally {
      setLoading(false);
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
