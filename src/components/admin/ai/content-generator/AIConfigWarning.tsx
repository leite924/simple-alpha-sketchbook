
import { memo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AIConfigWarningProps {
  isConfigured: boolean;
}

// Use memo to prevent unnecessary re-renders
const AIConfigWarning = memo(({ isConfigured }: AIConfigWarningProps) => {
  // Only render if not configured - no conditonal hooks here
  if (isConfigured) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        As configurações de IA não foram encontradas ou estão incompletas. 
        Verifique sua chave de API na seção de Configurações.
      </AlertDescription>
    </Alert>
  );
});

AIConfigWarning.displayName = "AIConfigWarning";

export default AIConfigWarning;
