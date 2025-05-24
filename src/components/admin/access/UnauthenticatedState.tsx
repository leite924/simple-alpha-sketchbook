
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnauthenticatedStateProps {
  onLogin: () => void;
}

const UnauthenticatedState: React.FC<UnauthenticatedStateProps> = ({ onLogin }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso Restrito</AlertTitle>
        <AlertDescription>
          Você precisa estar logado para acessar o painel de administração.
        </AlertDescription>
      </Alert>
      
      <div className="mt-6 flex flex-col items-center">
        <p className="mb-4 text-center text-muted-foreground">
          Faça login para acessar as funcionalidades administrativas.
        </p>
        <Button onClick={onLogin}>Login</Button>
      </div>
    </div>
  );
};

export default UnauthenticatedState;
