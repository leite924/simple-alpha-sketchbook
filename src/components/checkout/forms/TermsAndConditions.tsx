
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormPolicy } from '@/components/class/enrollment';
import { CheckoutFormValues } from '@/types/checkout';

interface TermsAndConditionsProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ register, errors }) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="agreeTerms" 
          {...register("agreeTerms")}
        />
        <Label htmlFor="agreeTerms">
          Concordo com os termos e condições
        </Label>
      </div>
      {errors.agreeTerms && (
        <p className="text-sm text-red-500">{errors.agreeTerms.message}</p>
      )}
      <FormPolicy />
    </>
  );
};

export default TermsAndConditions;
