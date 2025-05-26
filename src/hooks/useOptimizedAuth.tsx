
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
    
    console.log("🔄 Initializing auth...");

    // Function to fetch user role
    const fetchUserRole = async (userId: string) => {
      try {
        console.log("👤 Fetching user role for:", userId);
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
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
    };

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log("🔄 Auth state changed:", event);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole('viewer');
        }

        // Always set loading to false after handling auth state change
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error("❌ Initial session error:", error);
          setSession(null);
          setUser(null);
          setUserRole('viewer');
          setLoading(false);
          return;
        }

        console.log("✅ Initial session retrieved:", session ? "Found" : "None");
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole('viewer');
        }

        setLoading(false);
        console.log("✅ Auth initialization complete");
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setUserRole('viewer');
          setLoading(false);
        }
      }
    };

    // Initialize session
    getInitialSession();

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
