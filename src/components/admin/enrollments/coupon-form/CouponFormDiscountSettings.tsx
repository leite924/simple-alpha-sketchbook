
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DiscountCouponFormValues } from '@/types/enrollment';

interface CouponFormDiscountSettingsProps {
  control: Control<DiscountCouponFormValues>;
  watch: (field: string) => any;
}

const CouponFormDiscountSettings: React.FC<CouponFormDiscountSettingsProps> = ({ control, watch }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="discount_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Desconto*</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de desconto" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                <SelectItem value="fixed_amount">Valor Fixo (R$)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="discount_value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor do Desconto*</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder={watch('discount_type') === 'percentage' ? "Ex: 20" : "Ex: 50.00"}
                type="number"
                step={watch('discount_type') === 'percentage' ? "1" : "0.01"}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CouponFormDiscountSettings;
