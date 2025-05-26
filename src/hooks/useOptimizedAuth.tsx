
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
        console.log("🔄 Initializing auth...");
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error("❌ Auth error:", error);
          if (isMounted) {
            setSession(null);
            setUser(null);
            setUserRole('viewer');
            setLoading(false);
          }
          return;
        }

        console.log("✅ Session retrieved:", session ? "Found" : "None");
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("👤 Fetching user role for:", session.user.email);
          try {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            if (isMounted) {
              const role = roleData?.role || 'viewer';
              console.log("🎭 User role found:", role);
              setUserRole(role);
            }
          } catch (error) {
            console.error("❌ Role fetch error:", error);
            if (isMounted) {
              setUserRole('viewer');
            }
          }
        } else {
          setUserRole('viewer');
        }
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setUserRole('viewer');
        }
      } finally {
        if (isMounted) {
          console.log("✅ Auth initialization complete");
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log("🔄 Auth state changed:", event);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            if (isMounted) {
              const role = roleData?.role || 'viewer';
              console.log("🎭 Role updated:", role);
              setUserRole(role);
            }
          } catch (error) {
            console.error("❌ Role fetch error:", error);
            if (isMounted) {
              setUserRole('viewer');
            }
          }
        } else {
          setUserRole('viewer');
        }

        // Sempre definir loading como false após mudanças de estado
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("🚪 Signing out...");
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
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
