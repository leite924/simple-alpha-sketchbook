
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface AlertMessagesProps {
  errorMessage: string;
  showConfirmationAlert: boolean;
  email: string;
}

const AlertMessages: React.FC<AlertMessagesProps> = ({
  errorMessage,
  showConfirmationAlert,
  email
}) => {
  return (
    <>
      {errorMessage && (
        <Alert variant="destructive" className="mx-6 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {showConfirmationAlert && (
        <Alert className="mx-6 mb-4 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Conta criada com sucesso! Enviamos um email de confirmação para{' '}
            <strong>{email}</strong>. Verifique sua caixa de entrada e clique no link para ativar sua conta.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertMessages;
