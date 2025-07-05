
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
      console.log("🔍 Buscando usuários no sistema...");
      setLoading(true);
      setError(null);
      
      // Verificar se o usuário tem permissão
      const { data: { session } } = await supabase.auth.getSession();
      console.log("🔐 Sessão ativa:", !!session, "Email:", session?.user?.email);
      
      if (!session) {
        console.log("❌ Usuário não autenticado");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Buscar perfis primeiro
      console.log("👥 Buscando perfis...");
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, created_at')
        .order('created_at', { ascending: true });
        
      if (profilesError) {
        console.error("❌ Erro ao buscar perfis:", profilesError);
        throw profilesError;
      }
      
      console.log("✅ Perfis encontrados:", profiles?.length || 0);
      
      if (!profiles || profiles.length === 0) {
        console.log("⚠️ Nenhum perfil encontrado");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Buscar roles de usuários
      console.log("🎭 Buscando roles...");
      const { data: allRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
        
      if (rolesError) {
        console.error("❌ Erro ao buscar roles:", rolesError);
        console.log("ℹ️ Continuando sem roles do banco...");
      }
      
      console.log("📊 Roles do banco:", allRoles?.length || 0);
      
      // Criar mapa de roles para lookup rápido
      const rolesMap = new Map();
      allRoles?.forEach(roleEntry => {
        rolesMap.set(roleEntry.user_id, roleEntry.role);
      });
      
      // Processar usuários com roles
      const usersWithRoles: User[] = profiles
        .filter(profile => profile.email) // Só incluir perfis com email
        .map((profile, index) => {
          // Obter role do mapa ou determinar por email especial
          let finalRole: User["role"] = 'viewer';
          
          // Verificar emails especiais primeiro (prioridade máxima)
          if (profile.email === 'midiaputz@gmail.com') {
            finalRole = 'super_admin';
            console.log(`🔥 Super admin: ${profile.email}`);
          } else if (profile.email === 'elienaitorres@gmail.com') {
            finalRole = 'admin';
            console.log(`👑 Admin Elienai: ${profile.email}`);
          } else {
            // Usar role do banco se disponível
            const userRole = rolesMap.get(profile.id);
            if (userRole) {
              const roleMapping: Record<string, User["role"]> = {
                'super_admin': 'super_admin',
                'admin': 'admin',
                'instructor': 'instructor',
                'student': 'student',
                'viewer': 'viewer'
              };
              finalRole = roleMapping[userRole] || 'viewer';
            }
          }
          
          const firstName = profile.first_name || 'Usuário';
          const lastName = profile.last_name || '';
          
          return {
            id: index + 1, // ID sequencial para a interface
            name: `${firstName} ${lastName}`.trim(),
            email: profile.email || '',
            role: finalRole,
            status: 'active' as const,
            createdAt: new Date(profile.created_at),
            lastLogin: new Date() // Placeholder
          };
        });
      
      console.log("✅ Usuários processados:", usersWithRoles.length);
      console.log("📋 Lista final:", usersWithRoles.map(u => ({ 
        name: u.name, 
        email: u.email, 
        role: u.role 
      })));
      
      // Verificar se ambos os usuários importantes estão presentes
      const superAdmin = usersWithRoles.find(u => u.email === 'midiaputz@gmail.com');
      const elienai = usersWithRoles.find(u => u.email === 'elienaitorres@gmail.com');
      
      if (superAdmin) {
        console.log("✅ Super admin presente:", superAdmin.role);
      } else {
        console.log("⚠️ Super admin não encontrado");
      }
      
      if (elienai) {
        console.log("✅ Elienai presente:", elienai.role);
      } else {
        console.log("⚠️ Elienai não encontrada");
      }
      
      setUsers(usersWithRoles);
      
    } catch (err) {
      console.error("❌ Erro na busca de usuários:", err);
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
