
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
      console.log("🔍 === BUSCANDO USUÁRIOS REAIS DA BASE ===");
      setLoading(true);
      setError(null);
      
      // Verificar sessão
      const { data: { session } } = await supabase.auth.getSession();
      console.log("🔐 Sessão:", !!session, "Email:", session?.user?.email);
      
      if (!session) {
        console.log("❌ Usuário não autenticado");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Buscar perfis
      console.log("👥 Buscando perfis da base...");
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, created_at')
        .order('created_at', { ascending: true });
        
      if (profilesError) {
        console.error("❌ Erro ao buscar perfis:", profilesError);
        throw profilesError;
      }
      
      console.log(`✅ Perfis encontrados: ${profiles?.length || 0}`);
      console.log("📋 Perfis:", profiles?.map(p => ({ email: p.email, nome: `${p.first_name} ${p.last_name}` })));
      
      if (!profiles || profiles.length === 0) {
        console.log("⚠️ Nenhum perfil encontrado na base");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Buscar roles
      console.log("🎭 Buscando roles...");
      let allRoles: Array<{ user_id: string; role: string }> = [];
      
      try {
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');
          
        if (rolesError) {
          console.error("❌ Erro ao buscar roles:", rolesError);
          console.log("⚠️ Continuando sem roles (será usado viewer como padrão)");
        } else {
          allRoles = rolesData || [];
          console.log(`📊 Roles encontradas: ${allRoles.length}`);
          console.log("🎭 Roles:", allRoles.map(r => ({ user_id: r.user_id.substring(0, 8), role: r.role })));
        }
      } catch (rolesFetchError) {
        console.error("💥 Erro crítico ao buscar roles:", rolesFetchError);
        console.log("🔄 Continuando sem roles...");
      }
      
      // Criar mapa de roles
      const rolesMap = new Map<string, string>();
      allRoles.forEach(roleEntry => {
        rolesMap.set(roleEntry.user_id, roleEntry.role);
      });
      
      // Processar usuários reais
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
          
          console.log(`👤 Processando usuário: ${profile.email} -> Role: ${finalRole}`);
          
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
      
      console.log("✅ === RESULTADO FINAL ===");
      console.log(`📊 Total de usuários processados: ${realUsers.length}`);
      console.log("📋 Lista completa:", realUsers.map(u => ({ 
        name: u.name, 
        email: u.email, 
        role: u.role 
      })));
      
      setUsers(realUsers);
      toast.success(`${realUsers.length} usuários carregados da base de dados`);
      
    } catch (err) {
      console.error("💥 === ERRO CRÍTICO ===");
      console.error("Erro na busca de usuários:", err);
      
      setUsers([]);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      toast.error("Erro ao carregar usuários da base de dados");
      
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
