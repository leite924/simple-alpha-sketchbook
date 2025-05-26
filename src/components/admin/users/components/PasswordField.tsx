
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { UserFormValues } from "../types";

interface PasswordFieldProps {
  control: Control<UserFormValues>;
  isEditing: boolean;
  changePassword: boolean;
  isCurrentUserSuperAdmin: boolean;
}

const PasswordField = ({ control, isEditing, changePassword, isCurrentUserSuperAdmin }: PasswordFieldProps) => {
  if (isEditing && !changePassword) return null;

  return (
    <FormField
      control={control}
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
  );
};

export default PasswordField;
