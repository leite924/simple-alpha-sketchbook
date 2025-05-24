
import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginForm, setLoginForm] = React.useState({
    email: "midiaputz@gmail.com",
    password: "*Putz123"
  });
  
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", loginForm.email);
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      
      if (error) throw error;
      
      console.log("Login successful");
      toast.success("Login realizado com sucesso!");
      onLoginSuccess();
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(`Erro ao fazer login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginPageRedirect = () => {
    navigate('/login?register=true');
  };

  const handleAdminRedirect = () => {
    navigate('/admin');
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="seu@email.com"
                value={loginForm.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                name="password" 
                type="password"
                value={loginForm.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-between items-center">
              <a href="#" className="text-sm text-purple hover:underline">
                Esqueci minha senha
              </a>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processando..." : "Entrar"}
            </Button>
            
            <div className="flex justify-between pt-4">
              <Button onClick={handleLoginPageRedirect} variant="outline" size="sm">
                Página de Admin
              </Button>
              <Button onClick={handleAdminRedirect} variant="outline" size="sm">
                Ir para Admin
              </Button>
            </div>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Ainda não tem uma conta? <a href="#" className="text-purple hover:underline">Entre em contato</a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
