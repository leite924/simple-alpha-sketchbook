
import React, { useState } from "react";
import { useAdminAccess } from "./hooks/useAdminAccess";
import { assignDefaultAdminRole, assignHighestAdminRole } from "./services/roleService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoadingState from "./access/LoadingState";
import UnauthenticatedState from "./access/UnauthenticatedState";
import UnauthorizedState from "./access/UnauthorizedState";

interface AdminAccessProps {
  authenticated: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
}

const AdminAccess = ({ authenticated, children, isLoading = false }: AdminAccessProps) => {
  const navigate = useNavigate();
  const { userRole, checkingRole, userId } = useAdminAccess(authenticated);

  const handleAssignAdminRole = async () => {
    if (!userId) return;
    
    const success = await assignDefaultAdminRole(userId);
    if (success) {
      window.location.reload(); // Reload to apply new role
    }
  };
  
  const handleAssignHighestAdminRole = async () => {
    if (!userId) return;
    
    const success = await assignHighestAdminRole(userId);
    if (success) {
      window.location.reload(); // Reload to apply new role
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (isLoading || checkingRole) {
    return <LoadingState />;
  }

  if (!authenticated) {
    return <UnauthenticatedState onLogin={handleLoginRedirect} />;
  }

  if (userRole !== 'super_admin' && userRole !== 'admin' && userRole !== 'instructor') {
    return (
      <UnauthorizedState 
        onAssignAdmin={handleAssignAdminRole}
        onAssignHighestAdmin={handleAssignHighestAdminRole}
      />
    );
  }

  return <>{children}</>;
};

export default AdminAccess;
