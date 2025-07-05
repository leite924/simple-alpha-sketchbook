
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Crown } from 'lucide-react';

interface SuperAdminBadgeProps {
  className?: string;
}

const SuperAdminBadge = ({ className = '' }: SuperAdminBadgeProps) => {
  return (
    <Badge 
      variant="destructive" 
      className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold ${className}`}
    >
      <Crown className="h-3 w-3 mr-1" />
      SUPER ADMIN
      <Shield className="h-3 w-3 ml-1" />
    </Badge>
  );
};

export default SuperAdminBadge;
