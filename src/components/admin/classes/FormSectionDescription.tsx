
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../types";

const FormSectionDescription: React.FC = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormControl>
            <Textarea {...field} rows={4} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSectionDescription;
