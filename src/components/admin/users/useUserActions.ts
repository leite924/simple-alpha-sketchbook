
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
        // Atualizar o perfil no Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: values.name.split(' ')[0],
            last_name: values.name.split(' ').slice(1).join(' '),
            is_active: true
          })
          .eq('id', currentUser.email);
        
        if (profileError) throw profileError;
        
        // Atualizar a função do usuário se necessário
        const { data: existingRole, error: roleCheckError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', currentUser.email)
          .single();
          
        if (roleCheckError && roleCheckError.code !== 'PGRST116') {
          throw roleCheckError;
        }
        
        if (!existingRole) {
          // Inserir nova função
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: currentUser.email, 
              role: values.role 
            } as unknown as any);
            
          if (insertError) throw insertError;
        } else if (existingRole.role !== values.role) {
          console.log("Atualizando função de usuário para:", values.role);
          
          // Atualizar função existente
          const { error: updateError } = await supabase
            .from('user_roles')
            .update({ 
            role: values.role === "viewer" ? "user" : values.role 
          })
            .eq('user_id', currentUser.email);
            
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
        try {
          // Verificar se o usuário já existe no perfil
          const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', values.email)
            .single();
            
          if (checkError && checkError.code !== 'PGRST116') {
            console.error("Erro ao verificar perfil existente:", checkError);
            throw new Error(`Erro ao verificar perfil: ${checkError.message}`);
          }
          
          if (existingProfile) {
            throw new Error('Já existe um usuário com este email');
          }
          
          console.log("Criando perfil para:", values.email);
          
          // Criar um perfil no Supabase
          const { data, error } = await supabase
            .from('profiles')
            .insert({
              id: values.email,
              first_name: values.name.split(' ')[0],
              last_name: values.name.split(' ').slice(1).join(' '),
              email: values.email
            })
            .select();
          
          if (error) {
            console.error('Erro ao criar perfil:', error);
            throw new Error(`Erro ao salvar perfil: ${error.message}`);
          }
          
          console.log("Perfil criado com sucesso:", data);
          
          // Adicionar papel/função
          console.log("Atribuindo função:", values.role, "para usuário:", values.email);
          
          // Mapeamento de roles do frontend para roles do banco
          const roleMapping: Record<string, Database["public"]["Enums"]["user_role"]> = {
            "admin": "admin",
            "viewer": "user",
            "instructor": "instructor",
            "student": "student"
          };
          
          const dbRole = roleMapping[values.role] || "user";
          
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: values.email,
              role: dbRole
            });
            
          if (roleError) {
            console.error('Erro ao atribuir função:', roleError);
            throw new Error(`Erro ao atribuir função: ${roleError.message}`);
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
          toast.success("Usuário adicionado com sucesso!");
        } catch (error: any) {
          console.error("Erro específico ao criar usuário:", error);
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Erro ao gerenciar usuário:", error);
      toast.error(`Erro ao criar conta: ${error.message || 'Database error saving new user'}`);
      return false;
    } finally {
      handleDialogClose();
    }
    
    return true;
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
        
        // Excluir a função do usuário primeiro
        const { error: roleError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userToDelete.email);
          
        if (roleError) throw roleError;
        
        // Excluir o usuário do Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userToDelete.email);
        
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
