
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Key, UserCog, UserPlus } from "lucide-react";
import { useState } from "react";
import { usePasswordReset } from "../hooks/usePasswordReset";

const AdminPasswordReset = () => {
  const [email, setEmail] = useState("elienaitorres@gmail.com");
  const [newPassword, setNewPassword] = useState("123456");
  const { resetPasswordToDefault, createUserInAuth } = usePasswordReset();

  const handleReset = async () => {
    await resetPasswordToDefault(email, newPassword);
  };

  const handleCreateUser = async () => {
    await createUserInAuth(email, newPassword);
  };

  return (
    <Alert className="mb-6 bg-red-50 border-red-200">
      <UserCog className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-800">Ferramentas Administrativas de Usuário</AlertTitle>
      <AlertDescription className="text-red-700">
        <div className="mt-2 space-y-3">
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
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="gap-2 bg-red-100 hover:bg-red-200"
            >
              <Key className="h-4 w-4" />
              Reset Senha
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCreateUser}
              className="gap-2 bg-blue-100 hover:bg-blue-200"
            >
              <UserPlus className="h-4 w-4" />
              Criar no Auth
            </Button>
          </div>
          
          <div className="text-xs space-y-1">
            <p>⚠️ <strong>Reset Senha:</strong> Altera senha de usuário existente no auth.</p>
            <p>🔧 <strong>Criar no Auth:</strong> Cria usuário no auth se ele não existir.</p>
            <p>💡 Se "credenciais inválidas" persistir, use "Criar no Auth" primeiro.</p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AdminPasswordReset;
