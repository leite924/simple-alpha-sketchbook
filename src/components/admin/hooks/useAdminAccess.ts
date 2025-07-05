
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAdminAccess(authenticated: boolean) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!authenticated) {
        setCheckingRole(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setCheckingRole(false);
          return;
        }

        setUserId(session.user.id);
        console.log("🔍 Verificando role para usuário:", session.user.email);

        // Verificar se é o email especial do super admin
        if (session.user.email === 'midiaputz@gmail.com') {
          console.log("✅ Super admin detectado por email");
          setUserRole('super_admin');
          setCheckingRole(false);
          return;
        }

        // Buscar role na tabela user_roles
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (roleError) {
          console.error("❌ Erro ao buscar role:", roleError);
          setUserRole(null);
        } else if (roleData) {
          console.log("🎭 Role encontrada na tabela:", roleData.role);
          setUserRole(roleData.role);
        } else {
          console.log("⚠️ Nenhum role encontrado na tabela");
          setUserRole(null);
        }
      } catch (error) {
        console.error("❌ Erro ao verificar papel do usuário:", error);
        setUserRole(null);
      } finally {
        setCheckingRole(false);
      }
    };

    checkUserRole();
  }, [authenticated]);

  return { userRole, checkingRole, userId };
}
