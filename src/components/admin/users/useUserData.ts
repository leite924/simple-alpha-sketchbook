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
      console.log("🔍 === BUSCANDO USUÁRIOS APÓS INSERÇÃO DE ROLE ===");
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
      
      // Buscar perfis primeiro
      console.log("👥 Buscando todos os perfis...");
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, created_at')
        .order('created_at', { ascending: true });
        
      if (profilesError) {
        console.error("❌ Erro ao buscar perfis:", profilesError);
        throw profilesError;
      }
      
      console.log("✅ Perfis encontrados:", profiles?.length || 0);
      console.log("📋 Lista de perfis:", profiles?.map(p => ({ email: p.email, id: p.id })));
      
      if (!profiles || profiles.length === 0) {
        console.log("⚠️ Nenhum perfil encontrado no banco");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Buscar todos os roles de uma vez para eficiência
      console.log("🎭 Buscando todos os roles...");
      const { data: allRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
        
      if (rolesError) {
        console.error("❌ Erro ao buscar roles:", rolesError);
      }
      
      console.log("📊 Roles encontrados:", allRoles?.length || 0);
      console.log("🎭 Lista de roles:", allRoles?.map(r => ({ user_id: r.user_id, role: r.role })));
      
      // Criar mapa de roles por user_id para lookup rápido
      const rolesMap = new Map();
      allRoles?.forEach(roleEntry => {
        rolesMap.set(roleEntry.user_id, roleEntry.role);
      });
      
      // Processar os usuários com mapeamento correto
      const usersWithRoles: User[] = profiles
        .filter(profile => profile.email) // Só incluir perfis com email
        .map((profile, index) => {
          // Obter role do mapa
          const userRole = rolesMap.get(profile.id);
          
          console.log(`👤 Processando usuário ${index + 1}:`, {
            email: profile.email,
            userId: profile.id,
            roleFromMap: userRole,
            firstName: profile.first_name,
            lastName: profile.last_name
          });
          
          // Determinar role final baseado em lógica específica
          let finalRole: User["role"] = 'viewer';
          
          // Verificar emails especiais primeiro (prioridade máxima)
          if (profile.email === 'midiaputz@gmail.com') {
            finalRole = 'super_admin';
            console.log(`🔥 Super admin detectado por email: ${profile.email}`);
          } else if (profile.email === 'elienaitorres@gmail.com') {
            finalRole = 'admin';
            console.log(`👑 Admin Elienai detectado por email: ${profile.email}`);
          } else if (userRole) {
            // Mapear roles do banco para roles do frontend
            const roleMapping: Record<string, User["role"]> = {
              'super_admin': 'super_admin',
              'admin': 'admin',
              'instructor': 'instructor',
              'student': 'student',
              'viewer': 'viewer',
              'user': 'viewer' // Fallback para compatibilidade
            };
            
            finalRole = roleMapping[userRole] || 'viewer';
            console.log(`🎭 Role mapeado: ${userRole} -> ${finalRole}`);
          } else {
            console.log(`⚠️ Nenhum role encontrado para ${profile.email}, usando 'viewer' como padrão`);
          }
          
          const firstName = profile.first_name || 'Usuário';
          const lastName = profile.last_name || '';
          
          const processedUser = {
            id: index + 1, // ID sequencial para a interface
            name: `${firstName} ${lastName}`.trim(),
            email: profile.email || '',
            role: finalRole,
            status: 'active' as const,
            createdAt: new Date(profile.created_at),
            lastLogin: new Date() // Placeholder já que não temos essa info
          };
          
          console.log(`✅ Usuário processado:`, {
            name: processedUser.name,
            email: processedUser.email,
            role: processedUser.role
          });
          
          return processedUser;
        });
      
      console.log("✅ === RESULTADO FINAL ===");
      console.log("📊 Total de usuários processados:", usersWithRoles.length);
      console.log("👥 Lista completa:", usersWithRoles.map(u => ({ 
        name: u.name, 
        email: u.email, 
        role: u.role 
      })));
      
      // Verificações específicas
      const superAdminPresent = usersWithRoles.find(u => u.email === 'midiaputz@gmail.com');
      const elienaiPresent = usersWithRoles.find(u => u.email === 'elienaitorres@gmail.com');
      
      console.log("🔍 === VERIFICAÇÃO FINAL ===");
      console.log("- Super admin (midiaputz@gmail.com):", !!superAdminPresent, "Role:", superAdminPresent?.role);
      console.log("- Elienai (elienaitorres@gmail.com):", !!elienaiPresent, "Role:", elienaiPresent?.role);
      
      if (!elienaiPresent) {
        console.error("🚨 PROBLEMA: Elienai não está na lista final!");
      }
      
      if (!superAdminPresent) {
        console.error("🚨 PROBLEMA: Super admin não está na lista final!");
      }
      
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
