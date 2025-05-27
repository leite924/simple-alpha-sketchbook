
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
      console.log("🔍 Buscando usuários do Supabase...");
      setLoading(true);
      setError(null);
      
      // Primeiro, buscar todos os usuários da autenticação
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("❌ Erro ao buscar usuários da autenticação:", authError);
        throw authError;
      }
      
      console.log("✅ Usuários da autenticação encontrados:", authUsers.users.length);
      
      if (!authUsers.users || authUsers.users.length === 0) {
        console.log("⚠️ Nenhum usuário encontrado na autenticação");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Buscar perfis correspondentes
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
        console.error("❌ Erro ao buscar perfis:", profilesError);
        // Não falha se não conseguir buscar perfis, continua com dados da auth
      }
      
      console.log("✅ Perfis encontrados:", profilesData?.length || 0);
      
      // Buscar funções dos usuários
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
        
      if (rolesError) {
        console.error("⚠️ Erro ao buscar funções:", rolesError);
        // Não falha se não conseguir buscar funções, usa 'viewer' como padrão
      }
      
      console.log("✅ Funções encontradas:", rolesData?.length || 0);
      
      // Combinar dados de autenticação, perfis e funções
      const usersWithRoles: User[] = authUsers.users.map((authUser, index) => {
        const profile = profilesData?.find(p => p.id === authUser.id);
        const userRole = rolesData?.find(role => role.user_id === authUser.id);
        const role = userRole?.role || 'user';
        
        // Mapear roles do banco para roles do frontend
        const roleMapping: Record<string, User["role"]> = {
          'super_admin': 'super_admin',
          'admin': 'admin',
          'instructor': 'instructor',
          'student': 'student',
          'user': 'viewer'
        };
        
        const mappedRole = roleMapping[role] || 'viewer';
        
        // Usar dados do perfil se disponível, senão usar dados da autenticação
        const firstName = profile?.first_name || authUser.user_metadata?.first_name || authUser.email?.split('@')[0] || 'Usuário';
        const lastName = profile?.last_name || authUser.user_metadata?.last_name || '';
        
        return {
          id: index + 1, // ID sequencial para a interface
          name: `${firstName} ${lastName}`.trim(),
          email: profile?.email || authUser.email || '',
          role: mappedRole,
          status: 'active' as const,
          createdAt: new Date(profile?.created_at || authUser.created_at),
          lastLogin: authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at) : new Date()
        };
      });
      
      console.log("✅ Usuários processados:", usersWithRoles.length);
      console.log("👥 Lista de usuários:", usersWithRoles);
      setUsers(usersWithRoles);
      
    } catch (err) {
      console.error("❌ Erro ao buscar usuários:", err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("🔄 useUserData effect - isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      fetchUsersFromSupabase();
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
