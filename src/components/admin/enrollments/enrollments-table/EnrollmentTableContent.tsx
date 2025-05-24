
import React from 'react';
import { TableBody, TableRow, TableCell } from '@/components/ui/table';
import { EnrollmentWithDetails } from '@/types/enrollment';
import EnrollmentTableRow from './EnrollmentTableRow';

interface EnrollmentTableContentProps {
  enrollments: EnrollmentWithDetails[];
  filteredEnrollments: EnrollmentWithDetails[];
  isLoading: boolean;
  onViewDetails: (enrollment: EnrollmentWithDetails) => void;
}

const EnrollmentTableContent: React.FC<EnrollmentTableContentProps> = ({ 
  enrollments,
  filteredEnrollments, 
  isLoading, 
  onViewDetails 
}) => {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="text-center py-10">
            Carregando matrículas...
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (filteredEnrollments.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="text-center py-10">
            Nenhuma matrícula encontrada.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {filteredEnrollments.map((enrollment) => (
        <EnrollmentTableRow 
          key={enrollment.id} 
          enrollment={enrollment} 
          onViewDetails={onViewDetails}
        />
      ))}
    </TableBody>
  );
};

export default EnrollmentTableContent;
