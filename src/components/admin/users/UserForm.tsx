import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserFormValues } from "./types";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface UserFormProps {
  defaultValues: UserFormValues;
  onSubmit: (values: UserFormValues & { _changePassword?: boolean }) => Promise<boolean>;
  onCancel: () => void;
  isEditing: boolean;
}

const UserForm = ({ defaultValues, onSubmit, onCancel, isEditing }: UserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  
  const form = useForm<UserFormValues>({
    defaultValues
  });

  // Limpar o campo de senha quando o checkbox é desmarcado
  useEffect(() => {
    if (isEditing && !changePassword) {
      form.setValue('password', '');
    }
  }, [changePassword, isEditing, form]);

  const handleSubmit = async (values: UserFormValues) => {
    console.log("=== INÍCIO DA SUBMISSÃO DO FORM ===");
    console.log("Form submitted with values:", values);
    console.log("Change password checkbox?", changePassword);
    console.log("Is editing?", isEditing);
    
    setIsSubmitting(true);
    console.log("Estado isSubmitting definido para true");
    
    try {
      // LÓGICA SIMPLIFICADA PARA A FLAG
      let submitValues: any = { 
        ...values,
        _changePassword: isEditing ? changePassword : false // Se não está editando, não há intenção de alterar senha existente
      };
      
      console.log("Final _changePassword flag:", submitValues._changePassword);
      console.log("Final submit values:", submitValues);
      console.log("Chamando onSubmit...");
      
      const success = await onSubmit(submitValues);
      console.log("Resultado do onSubmit:", success);
      
      if (success) {
        console.log("Sucesso! Resetando form e estado...");
        form.reset();
        setChangePassword(false); // Reset checkbox state
        console.log("Form resetado");
      } else {
        console.log("onSubmit retornou false");
      }
    } catch (error) {
      console.error("Erro durante submissão:", error);
    } finally {
      console.log("Definindo isSubmitting para false");
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
                  />
                </FormControl>
                <FormMessage />
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
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
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
