
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setShowConfirmationAlert: (show: boolean) => void;
  setErrorMessage: (message: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  setShowConfirmationAlert,
  setErrorMessage
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setShowConfirmationAlert(false);

    // Validate password confirmation
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      // VERIFICAÇÃO CRÍTICA: Checar se email já existe antes de tentar criar
      console.log("🔍 Verificando se email já existe:", email);
      
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();
        
      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error("Erro ao verificar perfil existente:", profileCheckError);
        setErrorMessage('Erro ao verificar disponibilidade do email');
        setIsLoading(false);
        return;
      }
      
      if (existingProfile) {
        console.log("❌ Email já cadastrado:", existingProfile);
        
        // Mensagens específicas para emails administrativos
        if (email.toLowerCase() === 'midiaputz@gmail.com') {
          setErrorMessage('🚫 ERRO CRÍTICO: Este email já pertence ao Super Administrador do sistema!');
        } else if (email.toLowerCase() === 'elienaitorres@gmail.com') {
          setErrorMessage('🚫 ERRO: Este email já pertence a um administrador do sistema!');
        } else {
          setErrorMessage('⚠️ Este email já está cadastrado. Faça login ou use outro email.');
        }
        setIsLoading(false);
        return;
      }

      console.log("✅ Email disponível, prosseguindo com cadastro...");

      const { error } = await signUp(email, password, firstName, lastName);

      if (error) {
        if (error.message.includes('User already registered') || error.message.includes('already registered')) {
          setErrorMessage('🚫 Este email já está cadastrado no sistema. Tente fazer login.');
        } else if (error.message.includes('Password should be at least')) {
          setErrorMessage('A senha deve ter pelo menos 6 caracteres');
        } else {
          setErrorMessage(`Erro ao criar conta: ${error.message}`);
        }
      } else {
        setShowConfirmationAlert(true);
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      setErrorMessage('Erro inesperado ao criar conta. Tente novamente.');
    }

    setIsLoading(false);
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Seu nome"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Seu sobrenome"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-register">Email</Label>
          <Input
            id="email-register"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password-register">Senha</Label>
          <Input
            id="password-register"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar Senha</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar Conta'
          )}
        </Button>
      </form>
    </CardContent>
  );
};

export default RegisterForm;
