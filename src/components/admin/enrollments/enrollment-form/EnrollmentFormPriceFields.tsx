
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ManualEnrollmentFormValues } from '@/types/enrollment';

interface EnrollmentFormPriceFieldsProps {
  control: Control<ManualEnrollmentFormValues>;
}

const EnrollmentFormPriceFields: React.FC<EnrollmentFormPriceFieldsProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="original_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor Original*</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value}
                type="number"
                step="0.01"
                disabled
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="discount_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor do Desconto</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || 0}
                type="number"
                step="0.01"
                disabled
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="payment_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor Final*</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value}
                type="number"
                step="0.01"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EnrollmentFormPriceFields;
