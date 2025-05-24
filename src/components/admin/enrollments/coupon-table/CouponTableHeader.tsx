
import React from 'react';
import { Input } from '@/components/ui/input';

interface CouponTableHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const CouponTableHeader: React.FC<CouponTableHeaderProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Input
        placeholder="Buscar cupons..."
        className="max-w-xs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default CouponTableHeader;
