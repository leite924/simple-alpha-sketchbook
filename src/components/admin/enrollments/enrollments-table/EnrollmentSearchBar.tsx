
import React from 'react';
import { Input } from '@/components/ui/input';

interface EnrollmentSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const EnrollmentSearchBar: React.FC<EnrollmentSearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Input
        placeholder="Buscar matrículas..."
        className="max-w-xs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default EnrollmentSearchBar;
