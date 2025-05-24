
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClassForm from "../ClassForm";
import { ClassItem, FormValues } from "../types";

interface ClassFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  currentClass: ClassItem | null;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

const ClassFormDialog: React.FC<ClassFormDialogProps> = ({
  isOpen,
  onOpenChange,
  isEditing,
  currentClass,
  onSubmit,
  onCancel
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Turma" : "Nova Turma"}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {isEditing ? "atualizar a" : "criar uma nova"} turma.
          </DialogDescription>
        </DialogHeader>
        
        <ClassForm 
          isEditing={isEditing} 
          currentClass={currentClass}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClassFormDialog;
