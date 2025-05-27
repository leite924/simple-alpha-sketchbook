
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { UserFormValues } from "../types";

interface RoleFieldProps {
  control: Control<UserFormValues>;
  email: string;
}

const RoleField = ({ control, email }: RoleFieldProps) => {
  const isSuperAdmin = email === 'midiaputz@gmail.com';
  const isElienai = email === 'elienaitorres@gmail.com';

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
            disabled={isSuperAdmin || isElienai}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isSuperAdmin && (
                <SelectItem value="super_admin">Super Admin</SelectItem>
              )}
              {isElienai && (
                <SelectItem value="admin">Administrador</SelectItem>
              )}
              {!isSuperAdmin && !isElienai && (
                <>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="instructor">Instrutor</SelectItem>
                  <SelectItem value="student">Estudante</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
          {isSuperAdmin && (
            <p className="text-sm text-muted-foreground">
              Este email é automaticamente definido como Super Admin
            </p>
          )}
          {isElienai && (
            <p className="text-sm text-muted-foreground">
              Este email é automaticamente definido como Administrador
            </p>
          )}
        </FormItem>
      )}
    />
  );
};

export default RoleField;
