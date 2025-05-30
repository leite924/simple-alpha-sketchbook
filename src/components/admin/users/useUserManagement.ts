
import { User } from "../types";
import { useUserAuth } from "./useUserAuth";
import { useUserData } from "./useUserData";
import { useUserActions } from "./useUserActions";

export const useUserManagement = () => {
  // Manage authentication
  const { isAuthenticated, currentUserId } = useUserAuth();
  
  // Manage user data - removendo dados mocados iniciais
  const { 
    users, 
    setUsers, 
    filteredUsers, 
    searchTerm, 
    setSearchTerm, 
    isLoading,
    refreshUsers
  } = useUserData(isAuthenticated, []); // Array vazio em vez de dados mocados
  
  // Manage user actions
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditingUser,
    currentUser,
    handleUserSubmit,
    handleEditUser,
    handleDeleteUser,
    handleDialogClose,
    handleAddUser
  } = useUserActions(users as User[], setUsers, isAuthenticated, refreshUsers);

  // Return all necessary functionality
  return {
    users,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditingUser,
    currentUser,
    isLoading,
    isAuthenticated,
    currentUserId,
    handleUserSubmit,
    handleEditUser,
    handleDeleteUser,
    handleDialogClose,
    handleAddUser,
    refreshUsers
  };
};
