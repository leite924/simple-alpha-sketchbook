
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import { studentRegistrationSchema, StudentRegistrationFormData, StudentRegistrationFormProps } from './registration/types';
import PersonalDataSection from './registration/PersonalDataSection';
import AddressSection from './registration/AddressSection';
import WhatsAppSection from './registration/WhatsAppSection';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      // Só resetar se não houver erro
      reset();
      console.log('✅ Formulário resetado após cadastro bem-sucedido');
    } catch (error) {
      console.error('❌ Erro no handleFormSubmit:', error);
      // Não resetar o formulário em caso de erro
      if (error instanceof Error) {
        // Não mostrar toast aqui, deixar o componente pai tratar
        console.log('Erro tratado pelo componente pai:', error.message);
      } else {
        toast.error('Erro inesperado ao processar formulário');
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Cadastro de Aluno</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <Alert className="mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Processando cadastro... Aguarde alguns instantes.
            </AlertDescription>
          </Alert>
        )}

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
