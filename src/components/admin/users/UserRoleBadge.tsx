
import { cn } from "@/lib/utils";

interface UserRoleBadgeProps {
  role: "admin" | "viewer" | "instructor" | "student" | "super_admin";
}

const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  const styles = {
    admin: "bg-purple-100 text-purple-800",
    super_admin: "bg-red-100 text-red-800",
    instructor: "bg-blue-100 text-blue-800",
    viewer: "bg-gray-100 text-gray-800",
    student: "bg-green-100 text-green-800"
  };

  const labels = {
    admin: "Administrador",
    super_admin: "Super Admin",
    instructor: "Instrutor",
    viewer: "Visualizador",
    student: "Estudante"
  };

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs",
        styles[role]
      )}
    >
      {labels[role]}
    </span>
  );
};

export default UserRoleBadge;
