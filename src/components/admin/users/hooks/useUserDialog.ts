
import { useState } from "react";
import { User } from "../types";

export const useUserDialog = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditingUser(true);
    setIsAddDialogOpen(true);
  };

  const handleAddUser = (isAuthenticated: boolean) => {
    if (!isAuthenticated) {
      return;
    }
    
    setIsEditingUser(false);
    setCurrentUser(null);
    setIsAddDialogOpen(true);
  };

  const handleDialogClose = (): boolean => {
    setCurrentUser(null);
    setIsEditingUser(false);
    setIsAddDialogOpen(false);
    return true;
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditingUser,
    currentUser,
    handleEditUser,
    handleAddUser,
    handleDialogClose
  };
};
