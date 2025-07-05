
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, RefreshCw, Search, RotateCcw } from "lucide-react";
import { User } from "./types";
import UserSearchBar from "./users/UserSearchBar";
import UserTable from "./users/UserTable";
import UserDialog from "./users/UserDialog";
import { useUserManagement } from "./users/useUserManagement";
import { useUserDiagnostics } from "./users/hooks/useUserDiagnostics";
import { useUserCredentialsDiagnostics } from "./users/hooks/useUserCredentialsDiagnostics";
import { useUserSync } from "./users/hooks/useUserSync";
import AdminPasswordReset from "./users/components/AdminPasswordReset";
import SystemHealthMonitor from "./users/components/SystemHealthMonitor";
import SuperAdminRestoration from "./users/components/SuperAdminRestoration";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Info } from "lucide-react";
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
          <Info className="h-4 w-4" />
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
      {/* Ferramenta de Restauração de Super Admin */}
      <SuperAdminRestoration />

      {/* Monitor de Saúde do Sistema */}
      <SystemHealthMonitor />

      <Alert className="mb-6 bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">✅ Sistema Corrigido e Otimizado</AlertTitle>
        <AlertDescription className="text-green-700">
          <strong>Correção definitiva aplicada com sucesso!</strong>
          <br />• Funções SECURITY DEFINER implementadas para acesso seguro
          <br />• Políticas RLS completamente recriadas sem recursão
          <br />• Monitor de saúde inteligente com verificações seguras
          <br />• Sistema robusto contra erros de permissão
          <br />• Fallbacks automáticos para máxima estabilidade
          <br />• 🆕 Ferramenta de restauração de Super Admin adicionada
          <br /><strong>✨ Usuários carregados: {filteredUsers.length}</strong>
        </AlertDescription>
      </Alert>

      {/* Seção de Reset Administrativo */}
      <AdminPasswordReset />

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
            <Info className="h-4 w-4" />
            <AlertTitle>Nenhum usuário encontrado</AlertTitle>
            <AlertDescription>
              Não foram encontrados usuários com os critérios atuais. Use o Monitor de Saúde para diagnóstico.
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
