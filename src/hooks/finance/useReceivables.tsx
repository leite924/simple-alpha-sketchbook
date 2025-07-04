
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Hook for fetching receivables - placeholder since the table doesn't exist yet
export const useReceivables = () => {
  const fetchReceivables = async () => {
    console.log('Receivables functionality not yet implemented');
    return [];
  };
  
  return useQuery({
    queryKey: ['receivables'],
    queryFn: fetchReceivables,
  });
};
