
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setShowConfirmationAlert: (show: boolean) => void;
  setErrorMessage: (message: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  setShowConfirmationAlert,
  setErrorMessage
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setShowConfirmationAlert(false);

    const { error } = await signIn(email, password);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setErrorMessage('Email ou senha incorretos');
      } else if (error.message.includes('Email not confirmed')) {
        setErrorMessage('Por favor, confirme seu email antes de fazer login');
      } else {
        setErrorMessage(`Erro ao fazer login: ${error.message}`);
      }
    }

    setIsLoading(false);
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
      </form>
    </CardContent>
  );
};

export default LoginForm;
