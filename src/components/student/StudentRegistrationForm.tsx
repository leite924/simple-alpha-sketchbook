
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { studentRegistrationSchema, StudentRegistrationFormData, StudentRegistrationFormProps } from './registration/types';
import PersonalDataSection from './registration/PersonalDataSection';
import AddressSection from './registration/AddressSection';
import WhatsAppSection from './registration/WhatsAppSection';

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<StudentRegistrationFormData>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      countryCode: '+55'
    }
  });

  const handleFormSubmit = async (data: StudentRegistrationFormData) => {
    console.log('📝 Dados do formulário:', data);
    
    try {
      await onSubmit(data);
      reset();
      toast.success('Formulário resetado após sucesso');
    } catch (error) {
      console.error('❌ Erro no handleFormSubmit:', error);
      toast.error('Erro ao processar formulário');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Cadastro de Aluno</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <PersonalDataSection 
            register={register}
            errors={errors}
            setValue={setValue}
            isLoading={isLoading}
          />

          <AddressSection
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            isLoading={isLoading}
          />

          <WhatsAppSection
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            isLoading={isLoading}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Aluno'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentRegistrationForm;
