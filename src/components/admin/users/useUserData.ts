
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
      console.log("🔍 === BUSCANDO USUÁRIOS DO BANCO DE DADOS ===");
      console.log("📝 Parâmetros:", { isAuthenticated });
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
      
      // Verificar role do usuário atual
      const { data: currentUserRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();
        
      console.log("👤 Role do usuário atual:", currentUserRole?.role, roleError ? `(erro: ${roleError.message})` : '');
      
      // Buscar todos os perfis com suas respectivas roles
      console.log("👥 Buscando perfis e roles...");
      const { data: profilesWithRoles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          created_at,
          user_roles!inner(role)
        `);
        
      if (profilesError) {
        console.error("❌ Erro ao buscar perfis:", profilesError);
        throw profilesError;
      }
      
      console.log("✅ Perfis encontrados:", profilesWithRoles?.length || 0);
      console.log("📋 Dados brutos:", profilesWithRoles);
      
      if (!profilesWithRoles || profilesWithRoles.length === 0) {
        console.log("⚠️ Nenhum perfil encontrado no banco");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Mapear os dados para o formato esperado
      const usersWithRoles: User[] = profilesWithRoles.map((profile, index) => {
        const userRole = Array.isArray(profile.user_roles) ? profile.user_roles[0] : profile.user_roles;
        const role = userRole?.role || 'user';
        
        console.log(`👤 Processando usuário ${index + 1}:`, {
          email: profile.email,
          role: role,
          firstName: profile.first_name,
          lastName: profile.last_name
        });
        
        // Mapear roles do banco para roles do frontend
        const roleMapping: Record<string, User["role"]> = {
          'super_admin': 'super_admin',
          'admin': 'admin',
          'instructor': 'instructor',
          'student': 'student',
          'user': 'viewer'
        };
        
        const mappedRole = roleMapping[role] || 'viewer';
        
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
