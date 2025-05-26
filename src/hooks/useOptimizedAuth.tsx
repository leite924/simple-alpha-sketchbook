
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
    
    console.log("🔄 === INICIALIZANDO AUTH ===");

    // Function to fetch user role
    const fetchUserRole = async (userId: string) => {
      try {
        console.log("👤 Buscando role para userId:", userId);
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (error) {
          console.error("❌ Erro ao buscar role:", error);
          if (isMounted) setUserRole('viewer');
          return;
        }
        
        if (isMounted) {
          const role = roleData?.role || 'viewer';
          console.log("🎭 Role encontrada:", role);
          setUserRole(role);
        }
      } catch (error) {
        console.error("❌ Erro no catch fetchUserRole:", error);
        if (isMounted) setUserRole('viewer');
      }
    };

    // Initialize authentication state
    const initializeAuth = async () => {
      try {
        console.log("📋 Obtendo sessão inicial...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Erro ao obter sessão:", error);
          if (isMounted) {
            setSession(null);
            setUser(null);
            setUserRole('viewer');
            setLoading(false);
          }
          return;
        }

        if (!isMounted) return;

        console.log("🔍 Sessão obtida:", {
          existe: !!session,
          userId: session?.user?.id || 'N/A',
          email: session?.user?.email || 'N/A'
        });

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("👤 Usuário encontrado, buscando role...");
          await fetchUserRole(session.user.id);
        } else {
          console.log("👤 Nenhum usuário encontrado");
          setUserRole('viewer');
        }

        setLoading(false);
        console.log("✅ Inicialização de auth completa");

      } catch (error) {
        console.error("❌ Erro na inicialização de auth:", error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setUserRole('viewer');
          setLoading(false);
        }
      }
    };

    // Set up auth listener
    const setupAuthListener = () => {
      console.log("👂 Configurando listener de auth...");
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          if (!isMounted) return;
          
          console.log("🔄 Auth state changed:", {
            event,
            hasSession: !!newSession,
            userId: newSession?.user?.id || 'N/A'
          });
          
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (newSession?.user) {
            console.log("👤 Nova sessão detectada, buscando role...");
            await fetchUserRole(newSession.user.id);
          } else {
            console.log("👤 Sessão removida");
            setUserRole('viewer');
          }
          
          console.log("✅ Auth state atualizado");
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
        console.log("🛑 Removendo subscription de auth");
        subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    console.log("🚪 Fazendo logout...");
    setLoading(true);
    try {
      await supabase.auth.signOut();
      console.log("✅ Logout realizado");
    } catch (error) {
      console.error("❌ Erro no logout:", error);
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
