
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { DiscountCoupon, DiscountCouponFormValues } from '@/types/enrollment';
import {
  CouponFormBasicInfo,
  CouponFormDiscountSettings,
  CouponFormDateSettings,
  CouponFormUsageSettings,
  CouponFormCourseSelector,
  couponSchema
} from './coupon-form';

interface CouponFormProps {
  initialData?: DiscountCoupon;
  onSubmit: (values: DiscountCouponFormValues) => void;
  isSubmitting: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting 
}) => {
  const form = useForm<DiscountCouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: initialData || {
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      max_uses: '',
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: '',
      is_active: true,
      course_id: '',
      minimum_purchase: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CouponFormBasicInfo control={form.control} />
        <CouponFormDiscountSettings control={form.control} watch={form.watch} />
        <CouponFormDateSettings control={form.control} />
        <CouponFormUsageSettings control={form.control} />
        <CouponFormCourseSelector control={form.control} />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar Cupom' : 'Criar Cupom')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CouponForm;
