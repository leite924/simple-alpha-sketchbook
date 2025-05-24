
import { User } from "../types";
import { useUserAuth } from "./useUserAuth";
import { useUserData } from "./useUserData";
import { useUserActions } from "./useUserActions";

export const useUserManagement = (initialUsers: User[] = []) => {
  // Manage authentication
  const { isAuthenticated, currentUserId } = useUserAuth();
  
  // Manage user data
  const { 
    users, 
    setUsers, 
    filteredUsers, 
    searchTerm, 
    setSearchTerm, 
    isLoading 
  } = useUserData(isAuthenticated, initialUsers);
  
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
  } = useUserActions(users as User[], setUsers, isAuthenticated);

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
    handleAddUser
  };
};
