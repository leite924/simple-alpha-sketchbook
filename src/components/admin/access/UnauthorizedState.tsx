
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface UnauthorizedStateProps {
  onAssignAdmin: () => void;
  onAssignHighestAdmin: () => void;
}

const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({ 
  onAssignAdmin, 
  onAssignHighestAdmin 
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Permissão Negada</AlertTitle>
        <AlertDescription>
          Você não tem permissão para acessar o painel de administração.
          É necessário ter função de administrador ou instrutor.
        </AlertDescription>
      </Alert>
      
      <div className="mt-6 flex flex-col items-center space-y-4">
        <p className="text-center text-muted-foreground">
          Se você é o primeiro usuário do sistema, clique no botão abaixo para assumir o papel de administrador.
        </p>
        <Button onClick={onAssignAdmin}>
          Tornar-me Administrador
        </Button>
        <Button onClick={onAssignHighestAdmin} variant="outline">
          Tornar-me Administrador Máximo
        </Button>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/">Voltar para página inicial</Link>
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedState;
