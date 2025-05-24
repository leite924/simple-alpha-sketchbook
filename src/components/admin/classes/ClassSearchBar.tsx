
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ClassSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewClass: () => void;
}

const ClassSearchBar: React.FC<ClassSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onNewClass
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Input
        placeholder="Buscar turmas..."
        className="max-w-sm"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Button onClick={onNewClass} className="gap-2">
        <Plus className="h-4 w-4" /> Nova Turma
      </Button>
    </div>
  );
};

export default ClassSearchBar;
