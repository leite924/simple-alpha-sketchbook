
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useOptimizedAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('viewer');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Obter sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          setUser(initialSession.user);
          setSession(initialSession);
          setIsAuthenticated(true);
          
          // Verificar role do usuário
          if (initialSession.user.email === 'midiaputz@gmail.com') {
            setUserRole('super_admin');
          } else {
            // Buscar role do usuário na tabela user_roles
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', initialSession.user.id)
              .single();
            
            setUserRole(roleData?.role || 'viewer');
          }
        } else {
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          setUserRole('viewer');
        }
      } catch (error) {
        console.error('Erro ao obter sessão inicial:', error);
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        setUserRole('viewer');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          setSession(session);
          setIsAuthenticated(true);
          
          // Verificar role do usuário
          if (session.user.email === 'midiaputz@gmail.com') {
            setUserRole('super_admin');
          } else {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            setUserRole(roleData?.role || 'viewer');
          }
        } else {
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          setUserRole('viewer');
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setUserRole('viewer');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    user,
    session,
    loading,
    userRole,
    isAuthenticated,
    signOut
  };
};
