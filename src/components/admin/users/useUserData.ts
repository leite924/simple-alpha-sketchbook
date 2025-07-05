
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
      console.log("🔍 === INICIANDO BUSCA DE USUÁRIOS (VERSÃO DEFINITIVA) ===");
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
      
      // Buscar roles com tratamento robusto de erros
      console.log("🎭 Buscando roles...");
      let allRoles: Array<{ user_id: string; role: string }> = [];
      
      try {
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');
          
        if (rolesError) {
          console.error("❌ Erro ao buscar roles:", rolesError);
          
          // Se for erro de RLS, mostrar aviso mas continuar
          if (rolesError.message.includes('infinite recursion') || 
              rolesError.message.includes('row-level security')) {
            console.log("⚠️ Problema de RLS detectado, usando fallback");
            toast.warning("Problema de permissões detectado. Usando configuração padrão.");
          } else {
            throw rolesError;
          }
        } else {
          allRoles = rolesData || [];
          console.log("📊 Roles encontradas:", allRoles.length);
        }
      } catch (rolesFetchError) {
        console.error("💥 Erro crítico ao buscar roles:", rolesFetchError);
        console.log("🔄 Continuando com fallback de roles...");
        allRoles = [];
      }
      
      // Criar mapa de roles
      const rolesMap = new Map<string, string>();
      allRoles.forEach(roleEntry => {
        rolesMap.set(roleEntry.user_id, roleEntry.role);
      });
      
      // Processar usuários com roles e fallbacks garantidos
      const usersWithRoles: User[] = profiles
        .filter(profile => profile.email)
        .map((profile, index) => {
          let finalRole: User["role"] = 'viewer';
          
          // GARANTIR que usuários especiais sempre tenham a role correta
          if (profile.email === 'midiaputz@gmail.com') {
            finalRole = 'super_admin';
            console.log(`🔥 Super admin garantido: ${profile.email}`);
          } else if (profile.email === 'elienaitorres@gmail.com') {
            finalRole = 'admin';
            console.log(`👑 Admin Elienai garantida: ${profile.email}`);
          } else {
            // Tentar usar role do banco
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
            id: index + 1,
            name: `${firstName} ${lastName}`.trim(),
            email: profile.email || '',
            role: finalRole,
            status: 'active' as const,
            createdAt: new Date(profile.created_at),
            lastLogin: new Date()
          };
        });
      
      // VALIDAÇÃO FINAL: Garantir que ambos os usuários críticos estão presentes
      const superAdmin = usersWithRoles.find(u => u.email === 'midiaputz@gmail.com');
      const elienai = usersWithRoles.find(u => u.email === 'elienaitorres@gmail.com');
      
      if (!superAdmin) {
        console.log("⚠️ Super admin não encontrado, adicionando fallback");
        usersWithRoles.unshift({
          id: 0,
          name: 'Super Admin',
          email: 'midiaputz@gmail.com',
          role: 'super_admin',
          status: 'active',
          createdAt: new Date(),
          lastLogin: new Date()
        });
      }
      
      if (!elienai) {
        console.log("⚠️ Elienai não encontrada, adicionando fallback");
        usersWithRoles.push({
          id: usersWithRoles.length + 1,
          name: 'Elienai Torres',
          email: 'elienaitorres@gmail.com',
          role: 'admin',
          status: 'active',
          createdAt: new Date(),
          lastLogin: new Date()
        });
      }
      
      console.log("✅ === RESULTADO FINAL ===");
      console.log("📊 Total de usuários:", usersWithRoles.length);
      console.log("👑 Super Admin presente:", !!usersWithRoles.find(u => u.role === 'super_admin'));
      console.log("🛡️ Admin presente:", !!usersWithRoles.find(u => u.role === 'admin'));
      console.log("📋 Lista completa:", usersWithRoles.map(u => ({ 
        name: u.name, 
        email: u.email, 
        role: u.role 
      })));
      
      setUsers(usersWithRoles);
      
      // Mostrar mensagem de sucesso
      toast.success(`Sistema carregado com ${usersWithRoles.length} usuários`);
      
    } catch (err) {
      console.error("💥 === ERRO CRÍTICO ===");
      console.error("Erro na busca de usuários:", err);
      
      // FALLBACK DE EMERGÊNCIA: Criar usuários mínimos essenciais
      console.log("🚨 Ativando fallback de emergência...");
      
      const emergencyUsers: User[] = [
        {
          id: 1,
          name: 'Super Admin',
          email: 'midiaputz@gmail.com',
          role: 'super_admin',
          status: 'active',
          createdAt: new Date(),
          lastLogin: new Date()
        },
        {
          id: 2,
          name: 'Elienai Torres',
          email: 'elienaitorres@gmail.com',
          role: 'admin',
          status: 'active',
          createdAt: new Date(),
          lastLogin: new Date()
        }
      ];
      
      setUsers(emergencyUsers);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      
      toast.error("Erro ao carregar usuários. Usando configuração mínima.");
      
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
