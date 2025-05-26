
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserFormValues } from "../types";
import { Database } from "@/integrations/supabase/types";

export const useUserCreation = () => {
  const createUser = async (values: UserFormValues): Promise<boolean> => {
    console.log("Criando novo usuário:", values);
    
    try {
      // Verificar se já existe um usuário com este email
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email)
        .maybeSingle();
        
      if (checkError) {
        console.error("Erro ao verificar perfil existente:", checkError);
        throw new Error(`Erro ao verificar perfil: ${checkError.message}`);
      }
      
      if (existingProfile) {
        throw new Error('Já existe um usuário com este email. Verifique se o usuário não foi criado anteriormente.');
      }
      
      // Gerar um UUID para o novo perfil
      const profileId = crypto.randomUUID();
      console.log("Criando perfil com ID:", profileId, "para email:", values.email);
      
      // Criar um perfil no Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: profileId,
          first_name: values.name.split(' ')[0],
          last_name: values.name.split(' ').slice(1).join(' '),
          email: values.email
        });
      
      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        toast.error(`Erro ao criar perfil: ${profileError.message}`);
        return false;
      }
      
      console.log("Perfil criado com sucesso");
      
      // Mapeamento de roles do frontend para roles do banco
      const roleMapping: Record<string, Database["public"]["Enums"]["user_role"]> = {
        "admin": "admin",
        "viewer": "user",
        "instructor": "instructor",
        "student": "student"
      };
      
      const dbRole = roleMapping[values.role] || "user";
      console.log("Atribuindo função:", dbRole, "para usuário ID:", profileId);
      
      // Adicionar papel/função usando o UUID do perfil
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: profileId,
          role: dbRole
        });
        
      if (roleError) {
        console.error('Erro ao atribuir função:', roleError);
        
        // Se falhou ao criar a função, remover o perfil criado
        await supabase
          .from('profiles')
          .delete()
          .eq('id', profileId);
          
        toast.error(`Erro ao atribuir função: ${roleError.message}`);
        return false;
      }
      
      console.log("Função atribuída com sucesso");
      toast.success("Usuário criado com sucesso!");
      return true;
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      toast.error(error.message || 'Erro inesperado ao criar usuário');
      return false;
    }
  };

  return { createUser };
};
