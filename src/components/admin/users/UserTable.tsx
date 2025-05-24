
import { Edit, Lock, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User } from "../types";
import UserRoleBadge from "./UserRoleBadge";

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

const UserTable = ({ users, onEditUser, onDeleteUser }: UserTableProps) => {
  // Function to map any role value to one of the supported roles
  const mapToSupportedRole = (role: string): "admin" | "viewer" | "instructor" | "student" => {
    switch(role) {
      case "admin":
      case "super_admin": // Map super_admin to admin
        return "admin";
      case "instructor":
      case "professor":  // Map professor to instructor
      case "coordinator": // Map coordinator to instructor
        return "instructor";
      case "student":
        return "student";
      default:
        return "viewer";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Função</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead>Último login</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <UserRoleBadge role={mapToSupportedRole(user.role)} />
              </TableCell>
              <TableCell>{user.createdAt.toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>{user.lastLogin?.toLocaleDateString('pt-BR')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEditUser(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Lock className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteUser(user.id)}
                    disabled={mapToSupportedRole(user.role) === "admin" && users.filter((u) => mapToSupportedRole(u.role) === "admin").length === 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              Nenhum usuário encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UserTable;
