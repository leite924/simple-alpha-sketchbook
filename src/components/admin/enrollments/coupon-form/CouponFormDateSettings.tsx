
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DiscountCouponFormValues } from '@/types/enrollment';

interface CouponFormDateSettingsProps {
  control: Control<DiscountCouponFormValues>;
}

const CouponFormDateSettings: React.FC<CouponFormDateSettingsProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="valid_from"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Válido a partir de*</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="valid_until"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Válido até</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CouponFormDateSettings;
