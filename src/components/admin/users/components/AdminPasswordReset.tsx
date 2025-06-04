
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, UserPlus, UserCog, Key } from "lucide-react";
import { useState } from "react";
import { usePasswordReset } from "../hooks/usePasswordReset";

const AdminPasswordReset = () => {
  const [email, setEmail] = useState("elienaitorres@gmail.com");
  const [newPassword, setNewPassword] = useState("123456");
  const { resetPasswordDirectly, resetPasswordToDefault, createUserInAuth } = usePasswordReset();

  const handleDirectReset = async () => {
    await resetPasswordDirectly(email, newPassword);
  };

  const handleReset = async () => {
    await resetPasswordToDefault(email, newPassword);
  };

  const handleCreateUser = async () => {
    await createUserInAuth(email, newPassword);
  };

  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <UserCog className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">Ferramentas de Acesso de Usuário</AlertTitle>
      <AlertDescription className="text-blue-700">
        <div className="mt-2 space-y-3">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Email do usuário"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Senha sugerida"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-32"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDirectReset}
              className="gap-2 bg-red-100 hover:bg-red-200"
            >
              <Key className="h-4 w-4" />
              Reset Direto
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="gap-2 bg-blue-100 hover:bg-blue-200"
            >
              <Mail className="h-4 w-4" />
              Enviar Reset
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCreateUser}
              className="gap-2 bg-green-100 hover:bg-green-200"
            >
              <UserPlus className="h-4 w-4" />
              Criar Conta
            </Button>
          </div>
          
          <div className="text-xs space-y-1">
            <p>🔑 <strong>Reset Direto:</strong> Tenta definir senha diretamente no sistema.</p>
            <p>📧 <strong>Enviar Reset:</strong> Envia email para o usuário redefinir a senha.</p>
            <p>👤 <strong>Criar Conta:</strong> Cria nova conta se não existir.</p>
            <p>💡 <strong>Importante:</strong> O usuário precisará verificar o email para ativar a conta.</p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AdminPasswordReset;
