
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserFormValues, UserDialogProps } from "./types";
import UserForm from "./UserForm";

const UserDialog = ({ currentUser, isEditing, onSubmit, onOpenChange }: UserDialogProps) => {
  // Ensure we only use valid roles from our types definition
  const defaultValues: UserFormValues = {
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    role: (currentUser?.role as "admin" | "viewer" | "instructor" | "student") || "viewer",
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (values: UserFormValues): Promise<boolean> => {
    const success = await onSubmit(values);
    if (success) {
      onOpenChange(false);
    }
    return success;
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar Usuário" : "Adicionar Novo Usuário"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Altere os detalhes do usuário e clique em salvar."
            : "Preencha os detalhes do novo usuário."}
        </DialogDescription>
      </DialogHeader>

      <UserForm 
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={isEditing}
      />
    </DialogContent>
  );
};

export default UserDialog;
