import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserFormValues } from "./types";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface UserFormProps {
  defaultValues: UserFormValues;
  onSubmit: (values: UserFormValues & { _changePassword?: boolean }) => Promise<boolean>;
  onCancel: () => void;
  isEditing: boolean;
}

const UserForm = ({ defaultValues, onSubmit, onCancel, isEditing }: UserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [isCurrentUserSuperAdmin, setIsCurrentUserSuperAdmin] = useState(false);
  
  const form = useForm<UserFormValues>({
    defaultValues
  });

  // Verificar se o usuário atual é super admin
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

  // Limpar o campo de senha quando o checkbox é desmarcado
  useEffect(() => {
    if (isEditing && !changePassword) {
      form.setValue('password', '');
    }
  }, [changePassword, isEditing, form]);

  const handleSubmit = async (values: UserFormValues) => {
    console.log("=== INÍCIO DA SUBMISSÃO DO FORM ===");
    console.log("Valores do form:", values);
    console.log("Checkbox alterar senha:", changePassword);
    console.log("Modo edição:", isEditing);
    
    if (isSubmitting) {
      console.log("Já está processando, ignorando submissão duplicada");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Estado isSubmitting definido para true");
    
    try {
      const submitValues = { 
        ...values,
        _changePassword: isEditing ? changePassword : false
      };
      
      console.log("Valores finais para submissão:", submitValues);
      
      const success = await onSubmit(submitValues);
      console.log("Resultado do onSubmit:", success);
      
      if (success) {
        console.log("Sucesso! Resetando form...");
        form.reset();
        setChangePassword(false);
        console.log("Form resetado com sucesso");
      }
    } catch (error) {
      console.error("Erro durante submissão:", error);
    } finally {
      console.log("Finalizando submissão - definindo isSubmitting para false");
      setIsSubmitting(false);
      console.log("=== FIM DA SUBMISSÃO DO FORM ===");
    }
  };

  // Verificar se é o email especial para mostrar Super Admin
  const isSpecialAdmin = form.watch("email") === 'midiaputz@gmail.com';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do usuário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="changePassword" 
              checked={changePassword}
              onCheckedChange={(checked) => {
                console.log("Checkbox changePassword alterado para:", checked);
                setChangePassword(checked as boolean);
                if (!checked) {
                  form.setValue('password', '');
                }
              }}
            />
            <label htmlFor="changePassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Alterar senha
              {!isCurrentUserSuperAdmin && (
                <span className="text-xs text-muted-foreground ml-1">
                  (apenas super admins)
                </span>
              )}
            </label>
          </div>
        )}

        {(!isEditing || changePassword) && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isEditing ? "Nova Senha" : "Senha"}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder={isEditing ? "Digite a nova senha" : "Digite a senha"} 
                    {...field}
                    value={field.value || ''}
                    disabled={isEditing && !isCurrentUserSuperAdmin}
                  />
                </FormControl>
                <FormMessage />
                {isEditing && !isCurrentUserSuperAdmin && (
                  <p className="text-xs text-muted-foreground">
                    Apenas super administradores podem alterar senhas
                  </p>
                )}
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                disabled={isSpecialAdmin}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isSpecialAdmin && (
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  )}
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="instructor">Instrutor</SelectItem>
                  <SelectItem value="student">Estudante</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
              {isSpecialAdmin && (
                <p className="text-sm text-muted-foreground">
                  Este email é automaticamente definido como Super Admin
                </p>
              )}
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : (isEditing ? "Salvar" : "Adicionar")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
