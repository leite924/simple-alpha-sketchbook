
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { assignDefaultAdminRole } from "../services/roleService";

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
        console.log("Usuário autenticado:", session.user.email);

        // Check for user role in the user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError) {
          // If error is "no rows matched", user has no role assigned
          if (roleError.code === 'PGRST116') {
            console.log("Nenhum papel encontrado para o usuário, verificando se é admin");
            
            // Try to assign admin role to the first user if no roles exist in the table
            const { count, error: countError } = await supabase
              .from('user_roles')
              .select('*', { count: 'exact', head: true });
            
            if (!countError && count === 0) {
              console.log("Nenhum papel existe, atribuindo papel de admin ao primeiro usuário");
              await assignDefaultAdminRole(session.user.id);
              setUserRole('admin');
            } else {
              console.log("Papéis existem, mas usuário não tem nenhum");
              setUserRole(null);
            }
          } else {
            console.error("Erro ao buscar papel do usuário:", roleError);
            toast.error("Erro ao verificar permissões de usuário");
            setUserRole(null);
          }
        } else {
          console.log("Papel do usuário encontrado:", roleData?.role);
          setUserRole(roleData?.role || null);
        }
      } catch (error) {
        console.error("Erro ao verificar papel do usuário:", error);
        toast.error("Erro ao verificar funções de usuário");
      } finally {
        setCheckingRole(false);
      }
    };

    checkUserRole();
  }, [authenticated]);

  return { userRole, checkingRole, userId };
}
