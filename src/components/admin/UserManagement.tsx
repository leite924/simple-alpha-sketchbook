
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, RefreshCw, Search } from "lucide-react";
import { User } from "./types";
import UserSearchBar from "./users/UserSearchBar";
import UserTable from "./users/UserTable";
import UserDialog from "./users/UserDialog";
import { useUserManagement } from "./users/useUserManagement";
import { useUserDiagnostics } from "./users/hooks/useUserDiagnostics";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
      <div className="flex justify-between items-center">
        <UserSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={checkUserConsistency} 
            className="gap-2"
            disabled={isLoading}
          >
            <Search className="h-4 w-4" />
            Verificar
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
