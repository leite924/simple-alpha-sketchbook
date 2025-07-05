
import React from "react";
import { useAdminAccess } from "./hooks/useAdminAccess";
import { useNavigate } from "react-router-dom";
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

  console.log("🔍 AdminAccess estado:", {
    authenticated,
    userRole,
    checkingRole,
    isLoading,
    userId
  });

  const handleAssignAdminRole = async () => {
    console.log("🔧 Tentando atribuir role de admin...");
    // Esta funcionalidade será implementada se necessário
  };
  
  const handleAssignHighestAdminRole = async () => {
    console.log("🔧 Tentando atribuir role de super admin...");
    // Esta funcionalidade será implementada se necessário
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (isLoading || checkingRole) {
    console.log("⏳ Mostrando loading state");
    return <LoadingState />;
  }

  if (!authenticated) {
    console.log("❌ Usuário não autenticado");
    return <UnauthenticatedState onLogin={handleLoginRedirect} />;
  }

  // Verificar se tem permissão - permitir super_admin, admin e instructor
  const hasPermission = userRole === 'super_admin' || userRole === 'admin' || userRole === 'instructor';
  
  console.log("🔐 Verificação de permissão:", {
    userRole,
    hasPermission,
    allowedRoles: ['super_admin', 'admin', 'instructor']
  });

  if (!hasPermission) {
    console.log("❌ Usuário sem permissão suficiente");
    return (
      <UnauthorizedState 
        onAssignAdmin={handleAssignAdminRole}
        onAssignHighestAdmin={handleAssignHighestAdminRole}
      />
    );
  }

  console.log("✅ Usuário autorizado, renderizando conteúdo admin");
  return <>{children}</>;
};

export default AdminAccess;
