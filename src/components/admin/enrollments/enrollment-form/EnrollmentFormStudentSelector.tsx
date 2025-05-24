
import React from 'react';
import { Control } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEnrollmentFormValues } from '@/types/enrollment';
import { supabase } from '@/integrations/supabase/client';

interface EnrollmentFormStudentSelectorProps {
  control: Control<ManualEnrollmentFormValues>;
  disabled?: boolean;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface StudentDisplay {
  id: string;
  email: string;
  name: string;
}

const EnrollmentFormStudentSelector: React.FC<EnrollmentFormStudentSelectorProps> = ({ control, disabled }) => {
  // Buscar alunos (usuários)
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');
      
      if (error) throw new Error(error.message);
      
      // Tipagem segura para profiles
      const typedProfiles = (profiles || []) as Profile[];
      const results: StudentDisplay[] = [];
      
      for (const profile of typedProfiles) {
        // Buscar email diretamente da autenticação não é possível pela API cliente
        // Então simulamos isso com os dados do perfil
        results.push({
          id: profile.id,
          email: `user-${profile.id.substring(0, 8)}@example.com`,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || `Usuário ${profile.id.substring(0, 8)}`
        });
      }
      
      return results;
    }
  });

  return (
    <FormField
      control={control}
      name="student_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Aluno*</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isLoadingStudents || disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {(students || []).map((student: StudentDisplay) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.email})
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

export default EnrollmentFormStudentSelector;
