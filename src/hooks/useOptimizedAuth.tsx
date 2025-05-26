
import { useState, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

export const useOptimizedAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('viewer');

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error("Auth error:", error);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            if (isMounted) {
              setUserRole(roleData?.role || 'viewer');
            }
          } catch (error) {
            console.error("Role fetch error:", error);
            if (isMounted) {
              setUserRole('viewer');
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            if (isMounted) {
              setUserRole(roleData?.role || 'viewer');
            }
          } catch (error) {
            console.error("Role fetch error in auth change:", error);
            if (isMounted) {
              setUserRole('viewer');
            }
          }
        } else {
          setUserRole('viewer');
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    session,
    loading,
    userRole,
    isAuthenticated: !!session?.user,
    signOut
  };
};
