
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, RefreshCw, Search, RotateCcw, Key, UserCheck } from "lucide-react";
import { User } from "./types";
import UserSearchBar from "./users/UserSearchBar";
import UserTable from "./users/UserTable";
import UserDialog from "./users/UserDialog";
import { useUserManagement } from "./users/useUserManagement";
import { useUserDiagnostics } from "./users/hooks/useUserDiagnostics";
import { useUserCredentialsDiagnostics } from "./users/hooks/useUserCredentialsDiagnostics";
import { useUserSync } from "./users/hooks/useUserSync";
import AdminPasswordReset from "./users/components/AdminPasswordReset";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const UserManagement = () => {
  const [emailToCheck, setEmailToCheck] = useState("elienaitorres@gmail.com");
  
  const {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditingUser,
    currentUser,
    isLoading,
    isAuthenticated,
    handleUserSubmit,
    handleEditUser,
    handleDeleteUser,
    handleAddUser,
    refreshUsers
  } = useUserManagement();

  const { checkUserConsistency } = useUserDiagnostics();
  const { checkUserCredentials, resetUserPassword } = useUserCredentialsDiagnostics();
  const { syncAllUsers, cleanOrphanedProfiles } = useUserSync();

  const handleFullSync = async () => {
    console.log("🔄 Iniciando sincronização completa...");
    await cleanOrphanedProfiles();
    await syncAllUsers();
    await refreshUsers();
  };

  console.log("🏠 === ESTADO ATUAL DO UserManagement ===");
  console.log("🔐 isAuthenticated:", isAuthenticated);
  console.log("⏳ isLoading:", isLoading);
  console.log("👥 Total de usuários:", filteredUsers.length);
  console.log("🔍 Termo de busca:", searchTerm);
  console.log("📋 Lista de usuários:", filteredUsers.map(u => ({ name: u.name, email: u.email, role: u.role })));

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Autenticação necessária</AlertTitle>
          <AlertDescription>
            Você precisa estar logado para gerenciar usuários.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Sistema de Sincronização Automática</AlertTitle>
        <AlertDescription>
          O sistema agora sincroniza automaticamente os usuários entre a autenticação do Supabase e as tabelas do sistema.
          <br />Use o botão "Sincronizar Todos" para resolver qualquer inconsistência.
          <br /><strong>Total de usuários encontrados: {filteredUsers.length}</strong>
        </AlertDescription>
      </Alert>

      {/* Nova seção de Reset Administrativo */}
      <AdminPasswordReset />

      {/* Seção de Diagnóstico de Credenciais */}
      <Alert className="mb-6 bg-yellow-50 border-yellow-200">
        <UserCheck className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Diagnóstico de Credenciais</AlertTitle>
        <AlertDescription className="text-yellow-700">
          <div className="mt-2 space-y-2">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Email para verificar (ex: elienaitorres@gmail.com)"
                value={emailToCheck}
                onChange={(e) => setEmailToCheck(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => checkUserCredentials(emailToCheck)}
                className="gap-2 bg-yellow-100 hover:bg-yellow-200"
              >
                <UserCheck className="h-4 w-4" />
                Verificar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => resetUserPassword(emailToCheck)}
                className="gap-2 bg-blue-100 hover:bg-blue-200"
              >
                <Key className="h-4 w-4" />
                Reset Senha
              </Button>
            </div>
            <p className="text-xs">
              Use esta ferramenta para verificar se um usuário existe no sistema e diagnosticar problemas de login.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center">
        <UserSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleFullSync} 
            className="gap-2"
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4" />
            Sincronizar Todos
          </Button>
          
          <Button 
            variant="outline" 
            onClick={checkUserConsistency} 
            className="gap-2"
            disabled={isLoading}
          >
            <Search className="h-4 w-4" />
            Verificar Base
          </Button>
          
          <Button 
            variant="outline" 
            onClick={refreshUsers} 
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddUser} className="gap-2">
                <Plus className="h-4 w-4" /> Novo Usuário
              </Button>
            </DialogTrigger>
            
            <UserDialog
              isOpen={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onSubmit={handleUserSubmit}
              currentUser={currentUser}
              isEditing={isEditingUser}
            />
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="text-center text-gray-600">Carregando usuários...</div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="space-y-4">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhum usuário encontrado</AlertTitle>
            <AlertDescription>
              Não há usuários cadastrados no sistema. Verifique o console (F12) para mais detalhes ou use o botão "Verificar Base" para diagnóstico.
              <br />Você pode criar um novo usuário clicando no botão "Novo Usuário".
            </AlertDescription>
          </Alert>
          <UserTable
            users={filteredUsers}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default UserManagement;
