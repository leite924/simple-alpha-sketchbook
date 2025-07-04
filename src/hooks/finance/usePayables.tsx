
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Hook for fetching payables - placeholder since the table doesn't exist yet
export const usePayables = () => {
  const fetchPayables = async () => {
    console.log('Payables functionality not yet implemented');
    return [];
  };
  
  return useQuery({
    queryKey: ['payables'],
    queryFn: fetchPayables,
  });
};
