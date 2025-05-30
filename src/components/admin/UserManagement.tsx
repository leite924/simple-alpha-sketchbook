
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, RefreshCw, Search, RotateCcw } from "lucide-react";
import { User } from "./types";
import UserSearchBar from "./users/UserSearchBar";
import UserTable from "./users/UserTable";
import UserDialog from "./users/UserDialog";
import { useUserManagement } from "./users/useUserManagement";
import { useUserDiagnostics } from "./users/hooks/useUserDiagnostics";
import { useUserSync } from "./users/hooks/useUserSync";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const UserManagement = () => {
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
  const { syncAllUsers, cleanOrphanedProfiles } = useUserSync();

  const handleFullSync = async () => {
    console.log("🔄 Iniciando sincronização completa...");
    await cleanOrphanedProfiles();
    await syncAllUsers();
    await refreshUsers();
  };

  console.log("🏠 UserManagement render - isAuthenticated:", isAuthenticated, "isLoading:", isLoading, "users:", filteredUsers.length);

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
