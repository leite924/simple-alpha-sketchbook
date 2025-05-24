
import React from 'react';
import { Control } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DiscountCouponFormValues } from '@/types/enrollment';
import { supabase } from '@/integrations/supabase/client';

interface CouponFormCourseSelectorProps {
  control: Control<DiscountCouponFormValues>;
}

interface Course {
  id: string;
  name: string;
}

const CouponFormCourseSelector: React.FC<CouponFormCourseSelectorProps> = ({ control }) => {
  // Buscar cursos disponíveis
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, name')
        .eq('is_active', true);
      
      if (error) {
        console.error("Error loading courses:", error);
        throw new Error(error.message);
      }
      
      // Tipagem explícita
      return (data || []) as Course[];
    }
  });

  return (
    <FormField
      control={control}
      name="course_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Curso Específico (opcional)</FormLabel>
          <Select
            onValueChange={(value) => {
              console.log("Selected course value:", value);
              // Convert "all_courses" to null for the database
              field.onChange(value === "all_courses" ? null : value);
            }}
            // Make sure we convert null/undefined values to "all_courses" for the UI
            value={field.value === null || field.value === undefined || field.value === "" ? "all_courses" : field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Aplicável a todos os cursos" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="all_courses">Todos os cursos</SelectItem>
              {(courses || []).map((course: Course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CouponFormCourseSelector;
