
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, Shield } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const SuperAdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'midiaputz@gmail.com',
    password: '*Putz669'
  });
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Tentativa de login do Super Admin:', formData.email);
      
      // Primeiro, tentar fazer login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) {
        // Se o usuário não existe, criar a conta
        if (error.message.includes('Invalid login credentials')) {
          console.log('Usuário não existe, criando conta do Super Admin...');
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              emailRedirectTo: `${window.location.origin}/admin`
            }
          });
          
          if (signUpError) {
            console.error('Erro ao criar conta:', signUpError);
            toast.error(`Erro ao criar conta: ${signUpError.message}`);
            return;
          }
          
          if (signUpData.user) {
            console.log('Conta do Super Admin criada com sucesso!');
            toast.success('Conta criada com sucesso! Você foi logado automaticamente.');
            
            // Aguardar um momento para o trigger processar
            setTimeout(() => {
              navigate('/admin');
            }, 1000);
          }
        } else {
          console.error('Erro de login:', error);
          toast.error(`Erro ao fazer login: ${error.message}`);
        }
      } else if (data.session) {
        console.log('Login do Super Admin realizado com sucesso!');
        toast.success('Bem-vindo, Super Admin! Você tem poderes totais no sistema.');
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      toast.error(`Erro inesperado: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-purple-900">
              Super Admin Access
            </CardTitle>
            <CardDescription>
              Área exclusiva do Super Administrador
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="Digite seu email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pr-10"
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar como Super Admin'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Acesso exclusivo para administradores do sistema
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SuperAdminLogin;
