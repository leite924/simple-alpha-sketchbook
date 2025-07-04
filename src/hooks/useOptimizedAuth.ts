
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

export const useOptimizedAuth = (): OptimizedAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        // Get user role if authenticated
        if (session?.user) {
          try {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            if (!roleError && roleData) {
              setUserRole(roleData.role);
            } else if (session.user.email === 'midiaputz@gmail.com') {
              setUserRole('super_admin');
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            if (!roleError && roleData) {
              setUserRole(roleData.role);
            } else if (session.user.email === 'midiaputz@gmail.com') {
              setUserRole('super_admin');
            } else {
              setUserRole('');
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
            setUserRole('');
          }
        } else {
          setUserRole('');
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    userRole,
    isAuthenticated: !!user,
    signOut
  };
};
