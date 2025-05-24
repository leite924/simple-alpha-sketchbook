
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEnrollmentFormValues } from '@/types/enrollment';

interface EnrollmentFormStatusSelectorProps {
  control: Control<ManualEnrollmentFormValues>;
}

const EnrollmentFormStatusSelector: React.FC<EnrollmentFormStatusSelectorProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="payment_status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status do Pagamento*</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="overdue">Vencido</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EnrollmentFormStatusSelector;
