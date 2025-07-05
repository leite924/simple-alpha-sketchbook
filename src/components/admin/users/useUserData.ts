
import { useState, useEffect } from 'react';
import { User } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      setLoading(true);
      setError(null);
      
      // Verificar sessão
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Buscar perfis - agora com as novas políticas RLS funcionando
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, created_at')
        .order('created_at', { ascending: true });
        
      if (profilesError) {
        throw profilesError;
      }
      
      if (!profiles || profiles.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Buscar roles
      let allRoles: Array<{ user_id: string; role: string }> = [];
      
      try {
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');
          
        if (!rolesError) {
          allRoles = rolesData || [];
        }
      } catch (rolesFetchError) {
        // Continuar sem roles se houver erro
      }
      
      // Criar mapa de roles
      const rolesMap = new Map<string, string>();
      allRoles.forEach(roleEntry => {
        rolesMap.set(roleEntry.user_id, roleEntry.role);
      });
      
      // Processar usuários
      const realUsers: User[] = profiles
        .filter(profile => profile.email) // Apenas perfis com email
        .map((profile, index) => {
          const userRole = rolesMap.get(profile.id) || 'viewer';
          
          // Mapear roles para o tipo correto
          const roleMapping: Record<string, User["role"]> = {
            'super_admin': 'super_admin',
            'admin': 'admin',
            'instructor': 'instructor',
            'student': 'student',
            'viewer': 'viewer'
          };
          
          const finalRole = roleMapping[userRole] || 'viewer';
          const firstName = profile.first_name || 'Usuário';
          const lastName = profile.last_name || '';
          
          return {
            id: index + 1,
            name: `${firstName} ${lastName}`.trim(),
            email: profile.email || '',
            role: finalRole,
            status: 'active' as const,
            createdAt: new Date(profile.created_at),
            lastLogin: new Date()
          };
        });
      
      setUsers(realUsers);
      toast.success(`${realUsers.length} usuários carregados com sucesso`);
      
    } catch (err) {
      setUsers([]);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      toast.error("Erro ao carregar usuários");
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsersFromDatabase();
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
  
  const refreshUsers = () => {
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
