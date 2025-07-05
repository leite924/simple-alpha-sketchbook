
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

      // Verificar se o usuário é super admin
      const { data: superAdminData, error } = await supabase
        .from('super_admins')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.log('Usuário não é super admin:', error);
        setIsSuperAdmin(false);
        setSuperAdminData(null);
      } else {
        console.log('Super admin detectado:', superAdminData);
        setIsSuperAdmin(true);
        setSuperAdminData(superAdminData);
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
