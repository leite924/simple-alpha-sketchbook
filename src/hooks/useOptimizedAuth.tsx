
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

    // Initialize authentication state
    const initializeAuth = async () => {
      try {
        // Step 1: Get current session
        console.log("📋 Getting initial session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Session error:", error);
          if (isMounted) {
            setSession(null);
            setUser(null);
            setUserRole('viewer');
            setLoading(false);
          }
          return;
        }

        if (!isMounted) return;

        // Step 2: Set session and user
        console.log("✅ Session found:", session ? "Yes" : "No");
        setSession(session);
        setUser(session?.user ?? null);

        // Step 3: Fetch role if user exists
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole('viewer');
        }

        // Step 4: Mark initialization as complete
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

    // Step 5: Set up listener for future auth changes (after initialization)
    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          if (!isMounted) return;
          
          console.log("🔄 Auth state changed:", event);
          
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (newSession?.user) {
            await fetchUserRole(newSession.user.id);
          } else {
            setUserRole('viewer');
          }
          
          // Don't set loading here - it's only for initial load
          console.log("✅ Auth state updated");
        }
      );

      return subscription;
    };

    // Execute initialization then set up listener
    let subscription: any;
    
    initializeAuth().then(() => {
      if (isMounted) {
        subscription = setupAuthListener();
      }
    });

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
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
