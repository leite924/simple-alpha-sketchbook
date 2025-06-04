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
      console.log("🔍 === INICIANDO BUSCA DETALHADA DE USUÁRIOS ===");
      console.log("📝 Parâmetros:", { isAuthenticated });
      setLoading(true);
      setError(null);
      
      // Primeiro verificar se o usuário tem permissão para buscar usuários
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
      
      // Buscar usuários da autenticação
      console.log("🔍 Buscando usuários da autenticação...");
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("❌ Erro ao buscar usuários da autenticação:", authError);
        throw authError;
      }
      
      console.log("✅ Usuários da autenticação encontrados:", authUsers.users.length);
      console.log("📋 Lista de emails:", authUsers.users.map(u => u.email));
      
      if (!authUsers.users || authUsers.users.length === 0) {
        console.log("⚠️ Nenhum usuário encontrado na autenticação");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Buscar perfis correspondentes
      console.log("👥 Buscando perfis...");
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
      } else {
        console.log("✅ Perfis encontrados:", profilesData?.length || 0);
        console.log("📋 Perfis por email:", profilesData?.map(p => p.email));
      }
      
      // Buscar funções dos usuários
      console.log("🎭 Buscando roles...");
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
        
      if (rolesError) {
        console.error("⚠️ Erro ao buscar funções:", rolesError);
      } else {
        console.log("✅ Roles encontradas:", rolesData?.length || 0);
        console.log("📋 Roles por usuário:", rolesData?.map(r => ({ userId: r.user_id, role: r.role })));
      }
      
      // Combinar dados de autenticação, perfis e funções
      const usersWithRoles: User[] = authUsers.users.map((authUser, index) => {
        const profile = profilesData?.find(p => p.id === authUser.id);
        const userRole = rolesData?.find(role => role.user_id === authUser.id);
        const role = userRole?.role || 'user';
        
        console.log(`👤 Processando usuário ${index + 1}:`, {
          authEmail: authUser.email,
          profileEmail: profile?.email,
          role: role,
          hasProfile: !!profile,
          hasRole: !!userRole
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
