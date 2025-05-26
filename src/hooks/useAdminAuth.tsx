
import { useAuth } from "@/components/auth/AuthProvider";

export const useAdminAuth = () => {
  const { user, session, loading, userRole, isAuthenticated } = useAuth();

  return {
    authenticated: isAuthenticated,
    userRole,
    isLoading: loading,
    userId: user?.id || null,
    error: null,
    session
  };
};
