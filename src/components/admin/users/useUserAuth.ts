
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useUserAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('viewer');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setIsAuthenticated(true);
          setCurrentUserId(session.user.id);
          
          // Fetch user role
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (!roleError && roleData) {
            setCurrentUserRole(roleData.role);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentUserId(null);
          setCurrentUserRole('viewer');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session?.user);
      setCurrentUserId(session?.user?.id || null);
      
      if (session?.user) {
        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
          
        if (!roleError && roleData) {
          setCurrentUserRole(roleData.role);
        } else {
          setCurrentUserRole('viewer');
        }
      } else {
        setCurrentUserRole('viewer');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return { isAuthenticated, currentUserId, currentUserRole, isLoading };
};
