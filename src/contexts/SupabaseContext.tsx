import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import SupabaseService from '@/services/supabase.service';
import type { Enums } from '@/services/supabase.service';

// Definição do tipo de contexto
type SupabaseContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRoles: string[];
  userProfile: any | null;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  hasRole: (role: Enums<'user_role'>) => boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (
    firstName: string,
    lastName: string,
    cpf: string,
    birthDate: string,
    phone: string,
    address: string,
    addressNumber: string,
    addressComplement: string,
    neighborhood: string,
    city: string,
    state: string,
    postalCode: string
  ) => Promise<any>;
};

// Criação do contexto
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Hook para usar o contexto
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase deve ser usado dentro de um SupabaseProvider');
  }
  return context;
};

// Provedor do contexto
export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Inicialização e configuração de listeners
  useEffect(() => {
    // Obter a sessão atual
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Erro ao obter sessão inicial:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Limpar listener ao desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Carregar perfil e papéis do usuário quando o usuário mudar
  useEffect(() => {
    if (user) {
      loadUserRoles();
      loadUserProfile();
    } else {
      setUserRoles([]);
      setUserProfile(null);
    }
  }, [user]);

  // Função para carregar os papéis do usuário
  const loadUserRoles = async () => {
    if (!user) return;

    try {
      const { data, error } = await SupabaseService.getUserRoles(user.id);
      
      if (error) {
        console.error('Erro ao carregar papéis do usuário:', error);
        return;
      }

      if (data) {
        const roles = data.map((role: any) => role.role_name);
        setUserRoles(roles);
      }
    } catch (error) {
      console.error('Erro ao carregar papéis do usuário:', error);
    }
  };

  // Função para carregar o perfil do usuário
  const loadUserProfile = async () => {
    if (!user) return;

    setProfileLoading(true);
    try {
      const { data, error } = await SupabaseService.getUserProfile(user.id);
      
      if (error) {
        console.error('Erro ao carregar perfil do usuário:', error);
        return;
      }

      if (data && data.length > 0) {
        setUserProfile(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Função para atualizar o perfil do usuário
  const updateProfile = async (
    firstName: string,
    lastName: string,
    cpf: string,
    birthDate: string,
    phone: string,
    address: string,
    addressNumber: string,
    addressComplement: string,
    neighborhood: string,
    city: string,
    state: string,
    postalCode: string
  ) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const result = await SupabaseService.updateUserProfile(
        user.id,
        firstName,
        lastName,
        cpf,
        birthDate,
        phone,
        address,
        addressNumber,
        addressComplement,
        neighborhood,
        city,
        state,
        postalCode
      );

      if (result.error) {
        return { error: result.error };
      }

      // Recarregar o perfil após a atualização
      await loadUserProfile();
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { error };
    }
  };

  // Função para verificar se o usuário tem um papel específico
  const hasRole = (role: Enums<'user_role'>) => {
    return userRoles.includes(role);
  };

  // Funções de autenticação
  const signIn = async (email: string, password: string) => {
    return await SupabaseService.signIn(email, password);
  };

  const signUp = async (email: string, password: string) => {
    return await SupabaseService.signUp(email, password);
  };

  const signOut = async () => {
    return await SupabaseService.signOut();
  };

  const resetPassword = async (email: string) => {
    return await SupabaseService.resetPassword(email);
  };

  // Função para recarregar o perfil do usuário
  const refreshProfile = async () => {
    await loadUserProfile();
  };

  // Valor do contexto
  const value = {
    user,
    session,
    loading,
    userRoles,
    userProfile,
    profileLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    hasRole,
    refreshProfile,
    updateProfile
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
