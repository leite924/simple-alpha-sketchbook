
import { useAuth } from "@/components/auth/AuthProvider";

export const useBlogAuthentication = () => {
  const { user, loading, userRole, isAuthenticated } = useAuth();
  
  return {
    isAuthenticated,
    userProfile: user ? {
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || ''
    } : null,
    userId: user?.id || null,
    userRole,
    loading
  };
};
