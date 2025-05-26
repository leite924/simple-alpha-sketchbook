
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
        console.log("Initializing auth...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error("Auth initialization error:", error);
        }

        console.log("Session retrieved:", session ? "Found" : "None");
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("Fetching user role for:", session.user.email);
          try {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            if (isMounted) {
              const role = roleData?.role || 'viewer';
              console.log("User role found:", role);
              setUserRole(role);
            }
          } catch (error) {
            console.error("Role fetch error:", error);
            if (isMounted) {
              setUserRole('viewer');
            }
          }
        } else {
          setUserRole('viewer');
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (isMounted) {
          console.log("Auth initialization complete, setting loading to false");
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("Fetching role for user on auth change:", session.user.email);
          try {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            if (isMounted) {
              const role = roleData?.role || 'viewer';
              console.log("Role updated:", role);
              setUserRole(role);
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

        // Ensure loading is set to false after auth state change
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("Signing out...");
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
