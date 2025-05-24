
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertCircle } from "lucide-react";

interface AlertMessagesProps {
  errorMessage: string;
  showConfirmationAlert: boolean;
  email: string;
}

const AlertMessages = ({ errorMessage, showConfirmationAlert, email }: AlertMessagesProps) => {
  return (
    <>
      {errorMessage && (
        <Alert className="mx-6 mb-4 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {showConfirmationAlert && (
        <Alert className="mx-6 mb-4 bg-blue-50">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            Um email de confirmação foi enviado para <strong>{email}</strong>. 
            Por favor, verifique sua caixa de entrada e confirme seu email antes de fazer login.
            <br />
            <span className="text-xs mt-1 block">
              (Verifique também sua pasta de spam) 
              <br />
              Para administradores: faça login mesmo sem confirmar o email
            </span>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertMessages;
