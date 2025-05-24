
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DiscountCouponFormValues } from '@/types/enrollment';

interface CouponFormUsageSettingsProps {
  control: Control<DiscountCouponFormValues>;
}

const CouponFormUsageSettings: React.FC<CouponFormUsageSettingsProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="max_uses"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Limite de Usos</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                placeholder="Ex: 100"
                type="number"
                min="1"
                step="1"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="minimum_purchase"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor Mínimo de Compra</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                placeholder="Ex: 100.00"
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

export default CouponFormUsageSettings;
