
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ManualEnrollment, ManualEnrollmentFormValues } from '@/types/enrollment';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  EnrollmentFormStudentSelector,
  EnrollmentFormClassSelector,
  EnrollmentFormCouponApplier,
  EnrollmentFormPriceFields,
  EnrollmentFormStatusSelector,
  EnrollmentFormNotes,
  enrollmentSchema
} from './enrollment-form';

interface EnrollmentFormProps {
  initialData?: ManualEnrollment;
  onSubmit: (values: ManualEnrollmentFormValues) => void;
  isSubmitting: boolean;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting 
}) => {
  const form = useForm<ManualEnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: initialData || {
      student_id: '',
      class_id: '',
      payment_status: 'pending',
      payment_amount: '',
      original_amount: '',
      discount_amount: 0,
      notes: ''
    }
  });

  // Quando a turma é selecionada, atualizar o valor original
  useEffect(() => {
    const selectedClassId = form.watch('class_id');
    if (selectedClassId) {
      // Buscar detalhes da turma selecionada
      const fetchClassDetails = async () => {
        type ClassData = {
          id: string;
          price: number;
          course_name: string;
        };
        
        const { data, error } = await supabase
          .from('classes')
          .select('price')
          .eq('id', selectedClassId)
          .single();
          
        if (!error && data) {
          const typedData = data as unknown as ClassData;
          const originalAmount = parseFloat(String(typedData.price));
          form.setValue('original_amount', originalAmount);
          form.setValue('payment_amount', originalAmount);
          form.setValue('discount_amount', 0);
          // Limpar o cupom quando a turma muda
          if (form.getValues('coupon_id')) {
            form.setValue('coupon_id', undefined);
          }
        }
      };
      
      fetchClassDetails();
    }
  }, [form.watch('class_id')]);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnrollmentFormStudentSelector control={form.control} disabled={!!initialData} />
            <EnrollmentFormClassSelector control={form.control} disabled={!!initialData} />
          </div>

          <EnrollmentFormCouponApplier />
          <EnrollmentFormPriceFields control={form.control} />
          <EnrollmentFormStatusSelector control={form.control} />
          <EnrollmentFormNotes control={form.control} />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar Matrícula' : 'Realizar Matrícula')}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default EnrollmentForm;
