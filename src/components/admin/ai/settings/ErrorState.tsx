
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry?: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro ao carregar configurações de IA</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <div>Ocorreu um erro ao carregar as configurações. Por favor, tente novamente mais tarde.</div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="w-fit mt-2">
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorState;
