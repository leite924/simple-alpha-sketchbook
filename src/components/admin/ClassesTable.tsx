
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { ClassItem } from "./types";

interface ClassesTableProps {
  classes: ClassItem[];
  onEdit: (classItem: ClassItem) => void;
  onDelete: (id: number) => void;
}

const ClassesTable = ({ classes, onEdit, onDelete }: ClassesTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Vagas</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>{classItem.id}</TableCell>
                <TableCell className="font-medium">{classItem.courseName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{classItem.period}</Badge>
                </TableCell>
                <TableCell>
                  {classItem.month}/{classItem.year}
                </TableCell>
                <TableCell>
                  {classItem.spotsAvailable} / {classItem.totalSpots}
                </TableCell>
                <TableCell>{classItem.price}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(classItem)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(classItem.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Nenhuma turma encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClassesTable;
