import { useState, useEffect } from 'react';
import { User } from "../types";
import { supabase } from "@/integrations/supabase/client";

export const useUserData = (isAuthenticated: boolean = true, initialUsers: User[] = []) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const fetchUsersFromDatabase = async () => {
    try {
      console.log("🔍 === BUSCANDO USUÁRIOS DO BANCO DE DADOS (VERSÃO CORRIGIDA) ===");
      setLoading(true);
      setError(null);
      
      // Verificar se o usuário tem permissão
      const { data: { session } } = await supabase.auth.getSession();
      console.log("🔐 Sessão atual:", { 
        hasSession: !!session, 
        userId: session?.user?.id,
        email: session?.user?.email 
      });
      
      if (!session) {
        console.log("❌ Usuário não autenticado");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Buscar perfis com roles em uma única query usando JOIN
      console.log("👥 Buscando perfis com roles...");
      const { data: profilesWithRoles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          created_at,
          user_roles(role)
        `);
        
      if (profilesError) {
        console.error("❌ Erro ao buscar perfis:", profilesError);
        throw profilesError;
      }
      
      console.log("✅ Perfis com roles encontrados:", profilesWithRoles?.length || 0);
      console.log("📋 Dados dos perfis:", profilesWithRoles);
      
      if (!profilesWithRoles || profilesWithRoles.length === 0) {
        console.log("⚠️ Nenhum perfil encontrado no banco");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Processar os usuários
      const usersWithRoles: User[] = profilesWithRoles
        .filter(profile => profile.email) // Só incluir perfis com email
        .map((profile, index) => {
          // Obter a primeira role (deveria ter apenas uma por usuário agora)
          const userRole = profile.user_roles?.[0]?.role || 'user';
          
          console.log(`👤 Processando usuário ${index + 1}:`, {
            email: profile.email,
            role: userRole,
            firstName: profile.first_name,
            lastName: profile.last_name,
            userId: profile.id
          });
          
          // Mapear roles do banco para roles do frontend
          const roleMapping: Record<string, User["role"]> = {
            'super_admin': 'super_admin',
            'admin': 'admin',
            'instructor': 'instructor',
            'student': 'student',
            'user': 'viewer'
          };
          
          const mappedRole = roleMapping[userRole] || 'viewer';
          
          const firstName = profile.first_name || 'Usuário';
          const lastName = profile.last_name || '';
          
          return {
            id: index + 1, // ID sequencial para a interface
            name: `${firstName} ${lastName}`.trim(),
            email: profile.email || '',
            role: mappedRole,
            status: 'active' as const,
            createdAt: new Date(profile.created_at),
            lastLogin: new Date() // Placeholder já que não temos essa info
          };
        });
      
      console.log("✅ === USUÁRIOS PROCESSADOS FINAL ===");
      console.log("📊 Total de usuários:", usersWithRoles.length);
      console.log("👥 Lista completa:", usersWithRoles.map(u => ({ 
        name: u.name, 
        email: u.email, 
        role: u.role 
      })));
      
      setUsers(usersWithRoles);
      
    } catch (err) {
      console.error("❌ === ERRO CRÍTICO NA BUSCA ===", err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("🔄 useUserData effect - isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      fetchUsersFromDatabase();
    } else {
      console.log("⚠️ Usuário não autenticado, não buscando usuários");
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      createdAt: new Date(),
    };
    setUsers([...users, newUser]);
  };
  
  const updateUser = (id: number, userData: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };
  
  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };
  
  // Função para recarregar os dados
  const refreshUsers = () => {
    console.log("🔄 Recarregando usuários...");
    if (isAuthenticated) {
      fetchUsersFromDatabase();
    }
  };
  
  return {
    users,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    setUsers,
    loading,
    isLoading: loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    refreshUsers
  };
};
