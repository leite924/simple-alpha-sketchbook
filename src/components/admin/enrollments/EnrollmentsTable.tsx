
import React, { useState } from 'react';
import { EnrollmentWithDetails } from '@/types/enrollment';
import { Table } from '@/components/ui/table';
import { useManualEnrollmentActions } from '@/hooks/useManualEnrollments';
import {
  EnrollmentDetailsDialog,
  EnrollmentTableHeader,
  EnrollmentTableContent,
  EnrollmentSearchBar
} from './enrollments-table';

interface EnrollmentsTableProps {
  enrollments: EnrollmentWithDetails[];
  isLoading: boolean;
}

const EnrollmentsTable: React.FC<EnrollmentsTableProps> = ({ enrollments, isLoading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { updateEnrollment, cancelEnrollment } = useManualEnrollmentActions();

  const handleView = (enrollment: EnrollmentWithDetails) => {
    setSelectedEnrollment(enrollment);
    setIsDialogOpen(true);
  };

  // Filter enrollments by search term
  const filteredEnrollments = enrollments.filter(enrollment => 
    enrollment.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <EnrollmentSearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
      <div className="rounded-md border">
        <Table>
          <EnrollmentTableHeader />
          <EnrollmentTableContent
            enrollments={enrollments}
            filteredEnrollments={filteredEnrollments}
            isLoading={isLoading}
            onViewDetails={handleView}
          />
        </Table>
      </div>

      <EnrollmentDetailsDialog
        enrollment={selectedEnrollment}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default EnrollmentsTable;
