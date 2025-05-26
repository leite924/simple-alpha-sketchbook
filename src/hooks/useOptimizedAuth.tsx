
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
    let sessionInitialized = false;
    
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

    // Function to handle session changes
    const handleSessionChange = async (newSession: Session | null, source: string) => {
      if (!isMounted) return;
      
      console.log(`🔄 Session change from ${source}:`, newSession ? "Found" : "None");
      
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await fetchUserRole(newSession.user.id);
      } else {
        setUserRole('viewer');
      }

      // Only set loading to false if this is the initial session check
      if (!sessionInitialized) {
        sessionInitialized = true;
        setLoading(false);
        console.log("✅ Auth initialization complete");
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state changed:", event);
        await handleSessionChange(session, "auth state change");
      }
    );

    // Get initial session
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Initial session error:", error);
          if (isMounted) {
            await handleSessionChange(null, "initial session error");
          }
          return;
        }

        if (isMounted) {
          await handleSessionChange(session, "initial session");
        }
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        if (isMounted) {
          await handleSessionChange(null, "initialization error");
        }
      }
    };

    // Initialize session
    initializeSession();

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
