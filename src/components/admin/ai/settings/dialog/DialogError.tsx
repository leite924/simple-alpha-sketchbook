
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DialogErrorProps {
  error: string | null;
}

const DialogError = ({ error }: DialogErrorProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="my-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default DialogError;
