
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EnrollmentWithDetails } from '@/types/enrollment';

// Hook para buscar uma matrícula específica pelo ID
export const useEnrollmentDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['manual_enrollment', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('manual_enrollments')
        .select(`
          *,
          student:student_id(id, email),
          class:class_id(id, course_name, period, days),
          coupon:coupon_id(id, code, discount_value, discount_type)
        `)
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      
      // Tratamento seguro para acessar student.email com verificação de tipos
      const studentData = data.student as { email?: string } | null;
      const student_name = studentData && typeof studentData === 'object' && 'email' in studentData ? studentData.email : 'Usuário não encontrado';
      
      return {
        ...data,
        student_name,
        class_name: data.class ? `${data.class.course_name} - ${data.class.period} (${data.class.days})` : '',
        course_name: data.class?.course_name,
        coupon_code: data.coupon?.code
      } as EnrollmentWithDetails;
    },
    enabled: !!id,
  });
};
