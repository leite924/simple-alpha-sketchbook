
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const EnrollmentTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Aluno</TableHead>
        <TableHead>Curso / Turma</TableHead>
        <TableHead>Data</TableHead>
        <TableHead>Valor</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default EnrollmentTableHeader;
