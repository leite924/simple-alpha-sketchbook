
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePaymentProcessing } from '@/hooks/payments/usePaymentProcessing';
import type { CheckoutFormValues } from '@/types/checkout';
import { Button } from '@/components/ui/button';
import { checkoutSchema } from './validation/checkoutSchema';
import PersonalInfoForm from './forms/PersonalInfoForm';
import AddressForm from './forms/AddressForm';
import PaymentForm from './forms/PaymentForm';
import TermsAndConditions from './forms/TermsAndConditions';

// Define props interface for CheckoutForm
interface CheckoutFormProps {
  classId: string;
  classPrice: number;
  className: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ classId, classPrice, className }) => {
  const { processCheckout, isProcessing } = usePaymentProcessing();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'credit_card',
      classId: classId,
      agreeTerms: false
    }
  });

  const onSubmit = (values: CheckoutFormValues) => {
    processCheckout(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <PersonalInfoForm register={register} errors={errors} />
      <AddressForm register={register} errors={errors} />
      <PaymentForm register={register} watch={watch} errors={errors} />
      <TermsAndConditions register={register} errors={errors} />
      
      <input type="hidden" {...register("classId")} value={classId} />

      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? "Processando..." : "Finalizar Compra"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
