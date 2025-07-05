
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SuperAdminData {
  id: string;
  user_id: string;
  email: string;
  permissions: any;
  is_active: boolean;
}

export const useSuperAdminAuth = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [superAdminData, setSuperAdminData] = useState<SuperAdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkSuperAdminStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await checkSuperAdminStatus();
        } else {
          setUser(null);
          setIsSuperAdmin(false);
          setSuperAdminData(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkSuperAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsSuperAdmin(false);
        setSuperAdminData(null);
        setLoading(false);
        return;
      }

      setUser(session.user);

      // Verificar se o usuário é super admin pelo email
      if (session.user.email === 'midiaputz@gmail.com') {
        console.log('Super admin detectado pelo email:', session.user.email);
        setIsSuperAdmin(true);
        
        // Criar dados mock do super admin se necessário
        const mockSuperAdminData: SuperAdminData = {
          id: 'super-admin-1',
          user_id: session.user.id,
          email: session.user.email,
          permissions: { all: true, system_access: true, user_management: true, content_management: true },
          is_active: true
        };
        setSuperAdminData(mockSuperAdminData);
      } else {
        console.log('Usuário comum:', session.user.email);
        setIsSuperAdmin(false);
        setSuperAdminData(null);
      }
    } catch (error) {
      console.error('Erro ao verificar status de super admin:', error);
      setIsSuperAdmin(false);
      setSuperAdminData(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    isSuperAdmin,
    superAdminData,
    user,
    loading,
    checkSuperAdminStatus
  };
};
