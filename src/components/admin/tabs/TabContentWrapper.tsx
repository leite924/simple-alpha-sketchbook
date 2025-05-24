
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TabContentWrapperProps {
  children: React.ReactNode;
  label: string;
}

const TabContentWrapper: React.FC<TabContentWrapperProps> = ({ children, label }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    console.log(`TabContent (${label}) montado`);
    
    return () => {
      console.log(`TabContent (${label}) desmontado`);
    };
  }, [label]);
  
  // Adicionamos isso para resolver problemas com o React 18 Strict Mode
  useEffect(() => {
    // Resetar estado de erro quando o conteúdo muda
    setHasError(false);
    setErrorMessage("");
  }, [children]);
  
  // Enhanced error handling with better error information
  const renderSafeContent = () => {
    if (hasError) {
      return null;
    }
    
    try {
      return children;
    } catch (error) {
      console.error(`Erro ao renderizar conteúdo da aba ${label}:`, error);
      let message = "Erro desconhecido";
      
      if (error instanceof Error) {
        message = error.message;
        console.error("Stack trace:", error.stack);
      } else {
        message = String(error);
      }
      
      setHasError(true);
      setErrorMessage(message);
      return null;
    }
  };
  
  if (hasError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p><strong>Erro ao carregar conteúdo da aba {label}:</strong></p>
            <p className="text-sm break-words">{errorMessage}</p>
            <button 
              className="bg-destructive/20 hover:bg-destructive/30 text-destructive px-2 py-1 text-xs rounded"
              onClick={() => {
                setHasError(false);
                setErrorMessage("");
                // Dar tempo para o estado resetar antes de atualizar a página
                setTimeout(() => window.location.reload(), 100);
              }}
            >
              Recarregar página
            </button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="w-full" data-testid={`tab-content-${label.toLowerCase()}`}>
      {renderSafeContent()}
    </div>
  );
};

export default TabContentWrapper;
