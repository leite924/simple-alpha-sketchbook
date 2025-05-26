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
  
  const fetchUsersFromSupabase = async () => {
    try {
      console.log("Buscando usuários do Supabase...");
      setLoading(true);
      
      // Buscar perfis com suas funções
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          created_at
        `);
        
      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        throw profilesError;
      }
      
      console.log("Perfis encontrados:", profilesData?.length || 0);
      
      if (!profilesData || profilesData.length === 0) {
        console.log("Nenhum perfil encontrado");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Buscar funções dos usuários
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
        
      if (rolesError) {
        console.error("Erro ao buscar funções:", rolesError);
        // Não falha se não conseguir buscar funções, usa 'viewer' como padrão
      }
      
      console.log("Funções encontradas:", rolesData?.length || 0);
      
      // Combinar dados de perfis com funções
      const usersWithRoles: User[] = profilesData.map((profile, index) => {
        const userRole = rolesData?.find(role => role.user_id === profile.id);
        const role = userRole?.role || 'viewer';
        
        // Mapear roles do banco para roles do frontend - CORRIGIDO
        const roleMapping: Record<string, User["role"]> = {
          'super_admin': 'super_admin',  // Mapeamento correto
          'admin': 'admin',
          'instructor': 'instructor',
          'student': 'student',
          'user': 'viewer'
        };
        
        const mappedRole = roleMapping[role] || 'viewer';
        
        return {
          id: index + 1, // ID sequencial para a interface
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Usuário',
          email: profile.email || '',
          role: mappedRole,
          status: 'active' as const,
          createdAt: new Date(profile.created_at || new Date()),
          lastLogin: new Date() // Placeholder - não temos esta informação
        };
      });
      
      console.log("Usuários processados:", usersWithRoles.length);
      setUsers(usersWithRoles);
      
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsersFromSupabase();
    } else {
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
    if (isAuthenticated) {
      fetchUsersFromSupabase();
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
