
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserFormValues } from "./types";
import { useState, useEffect } from "react";
import { useCurrentUserRole } from "./hooks/useCurrentUserRole";
import { useUserFormSubmission } from "./hooks/useUserFormSubmission";
import PasswordChangeCheckbox from "./components/PasswordChangeCheckbox";
import PasswordField from "./components/PasswordField";
import RoleField from "./components/RoleField";
import FormActions from "./components/FormActions";

interface UserFormProps {
  defaultValues: UserFormValues;
  onSubmit: (values: UserFormValues & { _changePassword?: boolean }) => Promise<boolean>;
  onCancel: () => void;
  isEditing: boolean;
}

const UserForm = ({ defaultValues, onSubmit, onCancel, isEditing }: UserFormProps) => {
  const [changePassword, setChangePassword] = useState(false);
  const { isCurrentUserSuperAdmin } = useCurrentUserRole();
  
  const form = useForm<UserFormValues>({
    defaultValues
  });

  const { isSubmitting, handleSubmit } = useUserFormSubmission({
    onSubmit,
    isEditing,
    form
  });

  // Limpar o campo de senha quando o checkbox é desmarcado
  useEffect(() => {
    if (isEditing && !changePassword) {
      form.setValue('password', '');
    }
  }, [changePassword, isEditing, form]);

  const onFormSubmit = (values: UserFormValues) => {
    handleSubmit(values, changePassword, setChangePassword);
  };

  const handleChangePassword = (checked: boolean) => {
    setChangePassword(checked);
    if (!checked) {
      form.setValue('password', '');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
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

        <PasswordChangeCheckbox
          isEditing={isEditing}
          changePassword={changePassword}
          onChangePassword={handleChangePassword}
          isCurrentUserSuperAdmin={isCurrentUserSuperAdmin}
        />

        <PasswordField
          control={form.control}
          isEditing={isEditing}
          changePassword={changePassword}
          isCurrentUserSuperAdmin={isCurrentUserSuperAdmin}
        />

        <RoleField
          control={form.control}
          email={form.watch("email")}
        />

        <FormActions
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
        />
      </form>
    </Form>
  );
};

export default UserForm;
