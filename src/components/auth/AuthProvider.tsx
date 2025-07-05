
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('viewer');

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role
          await fetchUserRole(session.user.id, session.user.email);
        } else {
          setUserRole('viewer');
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await fetchUserRole(session.user.id, session.user.email);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string, email?: string) => {
    try {
      // Check if super admin by email first
      if (email === 'midiaputz@gmail.com') {
        setUserRole('super_admin');
        return;
      }

      // Fetch from user_roles table
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (!error && roleData) {
        setUserRole(roleData.role);
      } else {
        setUserRole('viewer');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('viewer');
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName || 'Usuário',
            last_name: lastName || ''
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      toast.success('Cadastro realizado com sucesso! Verifique seu email.');
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      toast.success('Login realizado com sucesso!');
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Erro ao fazer logout');
        return;
      }

      setUser(null);
      setSession(null);
      setUserRole('viewer');
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    isAuthenticated: !!session?.user,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
