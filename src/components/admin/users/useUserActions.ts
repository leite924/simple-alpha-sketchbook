import { useState } from "react";
import { UserFormValues, User } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

export function useUserActions(users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>, isAuthenticated: boolean) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleUserSubmit = async (values: UserFormValues): Promise<boolean> => {
    console.log("Iniciando cadastro de usuário:", values);
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para gerenciar usuários");
      return false;
    }
    
    try {
      if (isEditingUser && currentUser) {
        // Lógica de edição existente
        const { data: existingProfile, error: searchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', currentUser.email)
          .single();
          
        if (searchError) {
          console.error("Erro ao buscar perfil:", searchError);
          throw new Error(`Erro ao buscar perfil: ${searchError.message}`);
        }
        
        // Atualizar o perfil no Supabase usando o ID encontrado
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: values.name.split(' ')[0],
            last_name: values.name.split(' ').slice(1).join(' '),
          })
          .eq('id', existingProfile.id);
        
        if (profileError) throw profileError;
        
        // Atualizar a função do usuário se necessário
        const { data: existingRole, error: roleCheckError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', existingProfile.id)
          .single();
          
        if (roleCheckError && roleCheckError.code !== 'PGRST116') {
          throw roleCheckError;
        }
        
        if (!existingRole) {
          // Inserir nova função
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: existingProfile.id, 
              role: values.role === "viewer" ? "user" : values.role 
            } as unknown as any);
            
          if (insertError) throw insertError;
        } else if (existingRole.role !== (values.role === "viewer" ? "user" : values.role)) {
          console.log("Atualizando função de usuário para:", values.role);
          
          // Atualizar função existente
          const { error: updateError } = await supabase
            .from('user_roles')
            .update({ 
              role: values.role === "viewer" ? "user" : values.role 
            })
            .eq('user_id', existingProfile.id);
            
          if (updateError) {
            console.error("Erro ao atualizar função:", updateError);
            throw updateError;
          }
        }
        
        // Atualizar o estado local
        setUsers(
          users.map((user) =>
            user.id === currentUser.id
              ? { ...user, name: values.name, role: values.role as User["role"] }
              : user
          )
        );
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Lógica de criação de novo usuário
        console.log("Criando novo usuário:", values);
        
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
          throw new Error('Já existe um usuário com este email');
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
        
        // Adicionar ao estado local
        const newUser: User = {
          id: Math.max(0, ...users.map((user) => user.id)) + 1,
          name: values.name,
          email: values.email,
          role: values.role,
          status: "active",
          createdAt: new Date(),
          lastLogin: new Date()
        };
        setUsers([...users, newUser]);
        toast.success("Usuário criado com sucesso!");
      }
      
      // Fechar o diálogo e resetar estado
      handleDialogClose();
      return true;
    } catch (error: any) {
      console.error("Erro ao gerenciar usuário:", error);
      toast.error(error.message || 'Erro inesperado ao gerenciar usuário');
      return false;
    }
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditingUser(true);
    setIsAddDialogOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para excluir um usuário");
      return;
    }
    
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const userToDelete = users.find(u => u.id === userId);
        if (!userToDelete) {
          throw new Error("Usuário não encontrado");
        }
        
        // Buscar o perfil pelo email para obter o UUID
        const { data: profileData, error: searchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', userToDelete.email)
          .single();
          
        if (searchError) {
          throw new Error(`Erro ao encontrar perfil: ${searchError.message}`);
        }
        
        // Excluir a função do usuário primeiro
        const { error: roleError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', profileData.id);
          
        if (roleError) throw roleError;
        
        // Excluir o usuário do Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', profileData.id);
        
        if (profileError) throw profileError;
        
        // Atualizar o estado local
        setUsers(users.filter((user) => user.id !== userId));
        toast.success("Usuário excluído com sucesso!");
      } catch (error: any) {
        console.error("Erro ao excluir usuário:", error);
        toast.error(`Erro: ${error.message}`);
      }
    }
  };

  const handleDialogClose = (): boolean => {
    setCurrentUser(null);
    setIsEditingUser(false);
    setIsAddDialogOpen(false);
    return true;
  };

  const handleAddUser = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para adicionar usuários");
      return;
    }
    
    setIsEditingUser(false);
    setCurrentUser(null);
    setIsAddDialogOpen(true);
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditingUser,
    currentUser,
    handleUserSubmit,
    handleEditUser,
    handleDeleteUser,
    handleDialogClose,
    handleAddUser
  };
}
