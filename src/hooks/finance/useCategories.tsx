
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Hook for fetching financial categories - placeholder since the table doesn't exist yet
export const useCategories = () => {
  const fetchCategories = async () => {
    console.log('Financial categories functionality not yet implemented');
    return [];
  };
  
  return useQuery({
    queryKey: ['financialCategories'],
    queryFn: fetchCategories,
  });
};
