
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EnrollmentWithDetails } from '@/types/enrollment';

// Hook para buscar todas as matrículas manuais
export const useEnrollmentsList = () => {
  return useQuery({
    queryKey: ['manual_enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manual_enrollments')
        .select(`
          *,
          student:student_id(id, email),
          class:class_id(id, course_name, period, days),
          coupon:coupon_id(id, code, discount_value, discount_type)
        `)
        .order('enrollment_date', { ascending: false });

      if (error) throw new Error(error.message);
      
      // Formatar os dados para a interface EnrollmentWithDetails
      const formattedData = data.map((item: any) => {
        // Tratamento seguro para acessar student.email
        const studentEmail = item.student && typeof item.student === 'object' && 'email' in item.student ? item.student.email : null;
        
        return {
          ...item,
          student_name: studentEmail || 'Usuário não encontrado',
          class_name: item.class ? `${item.class.course_name} - ${item.class.period} (${item.class.days})` : 'Turma não encontrada',
          course_name: item.class?.course_name || 'Curso não encontrado',
          coupon_code: item.coupon?.code || ''
        };
      });
      
      return formattedData as EnrollmentWithDetails[];
    },
  });
};
