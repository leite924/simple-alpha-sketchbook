
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
    
    console.log("🔄 === INICIALIZANDO AUTH (VERSÃO MELHORADA) ===");
    console.log("⏰ Timestamp inicial:", new Date().toISOString());

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
        const startTime = Date.now();
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        const endTime = Date.now();
        console.log(`⏱️ Tempo para obter sessão: ${endTime - startTime}ms`);
        
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

        if (!isMounted) {
          console.log("🚫 Componente desmontado durante inicialização");
          return;
        }

        console.log("🔍 Sessão obtida:", {
          existe: !!session,
          userId: session?.user?.id || 'N/A',
          email: session?.user?.email || 'N/A',
          expiresAt: session?.expires_at || 'N/A'
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
        console.log("✅ Inicialização de auth completa em", Date.now() - startTime, "ms");

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
          if (!isMounted) {
            console.log("🚫 Listener ignorado - componente desmontado");
            return;
          }
          
          console.log("🔄 Auth state changed:", {
            event,
            hasSession: !!newSession,
            userId: newSession?.user?.id || 'N/A',
            timestamp: new Date().toISOString()
          });
          
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (newSession?.user) {
            console.log("👤 Nova sessão detectada, buscando role...");
            await fetchUserRole(newSession.user.id);
          } else {
            console.log("👤 Sessão removida, resetando para viewer");
            setUserRole('viewer');
          }
          
          // Importante: sempre definir loading como false após processar mudança de auth
          if (isMounted) {
            setLoading(false);
          }
          
          console.log("✅ Auth state atualizado");
        }
      );

      return subscription;
    };

    // Execute initialization then set up listener
    let subscription: any;
    
    const startInitialization = async () => {
      await initializeAuth();
      if (isMounted) {
        subscription = setupAuthListener();
      }
    };

    startInitialization().catch((error) => {
      console.error("💥 Erro crítico na inicialização:", error);
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      console.log("🧹 Limpando useOptimizedAuth...");
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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ Erro no logout:", error);
        setLoading(false);
        return;
      }
      
      console.log("✅ Logout realizado com sucesso");
      
      // Resetar todos os estados imediatamente
      setSession(null);
      setUser(null);
      setUserRole('viewer');
      setLoading(false);
      
    } catch (error) {
      console.error("❌ Erro no logout:", error);
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
