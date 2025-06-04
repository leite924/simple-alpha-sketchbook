
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Key, UserCog } from "lucide-react";
import { useState } from "react";
import { usePasswordReset } from "../hooks/usePasswordReset";

const AdminPasswordReset = () => {
  const [email, setEmail] = useState("elienaitorres@gmail.com");
  const [newPassword, setNewPassword] = useState("123456");
  const { resetPasswordToDefault } = usePasswordReset();

  const handleReset = async () => {
    await resetPasswordToDefault(email, newPassword);
  };

  return (
    <Alert className="mb-6 bg-red-50 border-red-200">
      <UserCog className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-800">Reset Administrativo de Senha</AlertTitle>
      <AlertDescription className="text-red-700">
        <div className="mt-2 space-y-2">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Email do usuário"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-32"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="gap-2 bg-red-100 hover:bg-red-200"
            >
              <Key className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <p className="text-xs">
            ⚠️ Ferramenta administrativa: Define uma nova senha diretamente no Supabase.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AdminPasswordReset;
