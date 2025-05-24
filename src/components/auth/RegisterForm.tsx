
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
    
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        
        if (error.message.includes("Email provider is not enabled") || 
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
          setShowConfirmationAlert(true);
          toast.success("Cadastro realizado! Verifique seu email para confirmar sua conta.");
        } else {
          // No email confirmation needed, user is signed in
          toast.success("Cadastro realizado com sucesso!");
          navigate("/admin");
        }
      }
    } catch (error: any) {
      setErrorMessage(`Erro ao criar conta: ${error.message}`);
      toast.error(`Erro ao criar conta: ${error.message}`);
      console.error("Erro completo:", error);
    } finally {
      setLoading(false);
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
