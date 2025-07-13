
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('E-mail e senha são obrigatórios');
      return;
    }

    setSubmitting(true);

    try {
      let result;
      
      if (isLogin) {
        result = await signIn(formData.email, formData.password);
      } else {
        if (!formData.firstName) {
          toast.error('Nome é obrigatório para cadastro');
          return;
        }
        result = await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
      }

      if (!result.error) {
        navigate('/');
      } else {
        const errorMessage = result.error.message || 'Erro desconhecido';
        
        if (errorMessage.includes('Invalid login credentials')) {
          toast.error('E-mail ou senha incorretos');
        } else if (errorMessage.includes('User already registered')) {
          toast.error('Este e-mail já está cadastrado. Tente fazer login.');
        } else if (errorMessage.includes('Password should be at least 6 characters')) {
          toast.error('A senha deve ter pelo menos 6 caracteres');
        } else if (errorMessage.includes('Unable to validate email address')) {
          toast.error('E-mail inválido');
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      toast.error('Erro interno. Tente novamente.');
      console.error('Auth error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? 'Entre com suas credenciais para acessar o sistema'
              : 'Preencha os dados para criar sua conta'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="João"
                    required={!isLogin}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Silva"
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="joao@exemplo.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitting || loading}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Entrando...' : 'Cadastrando...'}
                </>
              ) : (
                isLogin ? 'Entrar' : 'Cadastrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin 
                ? 'Não tem conta? Cadastre-se'
                : 'Já tem conta? Faça login'
              }
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-muted-foreground hover:text-primary text-sm">
              ← Voltar ao início
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
