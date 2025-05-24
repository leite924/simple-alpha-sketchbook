
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ManualEnrollmentFormValues } from '@/types/enrollment';

interface EnrollmentFormNotesProps {
  control: Control<ManualEnrollmentFormValues>;
}

const EnrollmentFormNotes: React.FC<EnrollmentFormNotesProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observações</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder="Observações adicionais" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EnrollmentFormNotes;
