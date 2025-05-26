
import { UserFormValues, User } from "./types";
import { toast } from "sonner";
import { useUserCreation } from "./hooks/useUserCreation";
import { useUserEditing } from "./hooks/useUserEditing";
import { useUserDeletion } from "./hooks/useUserDeletion";
import { useUserDialog } from "./hooks/useUserDialog";

export function useUserActions(
  users: User[], 
  setUsers: React.Dispatch<React.SetStateAction<User[]>>, 
  isAuthenticated: boolean,
  refreshUsers?: () => void
) {
  const { createUser } = useUserCreation();
  const { editUser } = useUserEditing();
  const { deleteUser } = useUserDeletion();
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditingUser,
    currentUser,
    handleEditUser,
    handleAddUser: handleAddUserDialog,
    handleDialogClose
  } = useUserDialog();

  const handleUserSubmit = async (values: UserFormValues): Promise<boolean> => {
    console.log("Iniciando operação de usuário:", values);
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para gerenciar usuários");
      return false;
    }
    
    try {
      let success = false;
      
      if (isEditingUser && currentUser) {
        success = await editUser(currentUser, values);
      } else {
        success = await createUser(values);
      }
      
      if (success) {
        // Recarregar os dados dos usuários após a operação
        if (refreshUsers) {
          refreshUsers();
        }
        
        // Fechar o diálogo e resetar estado
        handleDialogClose();
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Erro ao gerenciar usuário:", error);
      toast.error(error.message || 'Erro inesperado ao gerenciar usuário');
      return false;
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para excluir um usuário");
      return;
    }
    
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      const success = await deleteUser(userId, users);
      if (success && refreshUsers) {
        refreshUsers();
      }
    }
  };

  const handleAddUser = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para adicionar usuários");
      return;
    }
    
    handleAddUserDialog(isAuthenticated);
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditingUser,
    currentUser,
    handleUserSubmit,
    handleEditUser,
    handleDeleteUser,
    handleDialogClose,
    handleAddUser
  };
}
