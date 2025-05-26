
export interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "viewer" | "instructor" | "student" | "super_admin";
  _changePassword?: boolean; // Flag para indicar intenção de alterar senha
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "viewer" | "instructor" | "student" | "super_admin";
  status: "active" | "inactive" | "pending";
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues & { _changePassword?: boolean }) => Promise<boolean>;
  currentUser?: User | null;
  isEditing: boolean;
}

export interface Permission {
  role: string;
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}
