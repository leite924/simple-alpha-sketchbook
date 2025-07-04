
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setIsLoading(false);
          return;
        }

        if (!session) {
          setAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setAuthenticated(true);

        // Check user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError) {
          console.error('Role error:', roleError);
          if (session.user.email === 'midiaputz@gmail.com') {
            setUserRole('super_admin');
          } else {
            setUserRole('user');
          }
        } else {
          setUserRole(roleData.role);
        }

      } catch (err: any) {
        console.error('Auth check error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setAuthenticated(false);
          setUserRole('');
        } else {
          setAuthenticated(true);
          
          // Check user role
          try {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();

            if (roleError) {
              if (session.user.email === 'midiaputz@gmail.com') {
                setUserRole('super_admin');
              } else {
                setUserRole('user');
              }
            } else {
              setUserRole(roleData.role);
            }
          } catch (err) {
            console.error('Role check error:', err);
            setUserRole('user');
          }
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    authenticated,
    userRole,
    isLoading,
    error
  };
};
