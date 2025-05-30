
import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useOptimizedAuth();

  // Debug log melhorado para verificar estados
  console.log("🏠 AuthProvider render com estados:", {
    user: auth.user?.email || null,
    loading: auth.loading,
    userRole: auth.userRole,
    isAuthenticated: auth.isAuthenticated,
    hasSession: !!auth.session,
    timestamp: new Date().toISOString()
  });

  // Log adicional se estiver carregando por muito tempo
  if (auth.loading) {
    console.log("⏳ AuthProvider ainda carregando...", {
      tempoDecorrido: Date.now(),
      user: auth.user?.email,
      session: !!auth.session
    });
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
