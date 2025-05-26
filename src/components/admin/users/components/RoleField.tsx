
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { UserFormValues } from "../types";

interface RoleFieldProps {
  control: Control<UserFormValues>;
  email: string;
}

const RoleField = ({ control, email }: RoleFieldProps) => {
  const isSpecialAdmin = email === 'midiaputz@gmail.com';

  return (
    <FormField
      control={control}
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
  );
};

export default RoleField;
