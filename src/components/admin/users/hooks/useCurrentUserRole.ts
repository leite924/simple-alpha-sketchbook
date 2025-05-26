
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCurrentUserRole = () => {
  const [isCurrentUserSuperAdmin, setIsCurrentUserSuperAdmin] = useState(false);

  useEffect(() => {
    const checkCurrentUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          setIsCurrentUserSuperAdmin(roleData?.role === 'super_admin');
        }
      } catch (error) {
        console.error("Erro ao verificar role do usuário:", error);
      }
    };

    checkCurrentUserRole();
  }, []);

  return { isCurrentUserSuperAdmin };
};
