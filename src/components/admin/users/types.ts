
export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "viewer" | "instructor" | "student";
  status: "active" | "inactive" | "pending";
  createdAt: Date;
  lastLogin?: Date;
};

export interface UserFormValues {
  name: string;
  email: string;
  role: "admin" | "viewer" | "instructor" | "student";
}

export interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => void;
  currentUser: User | null;
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

export interface UserFilterState {
  searchTerm: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  is_system_role?: boolean;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at?: string;
}

export interface RolePermission {
  id: string;
  role: string; 
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  created_at?: string;
}
