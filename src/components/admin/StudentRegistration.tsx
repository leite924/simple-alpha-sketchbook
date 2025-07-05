
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import StudentRegistrationForm from '@/components/student/StudentRegistrationForm';
import { createUser } from '@/services/profileService';
import { toast } from 'sonner';

const AdminStudentRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStudentRegistration = async (data: any) => {
    setIsLoading(true);
    try {
      // Formatar dados para criação do usuário
      const [firstName, ...lastNameParts] = data.fullName.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const userId = await createUser(
        data.email,
        firstName,
        lastName,
        {
          cpf: data.cpf.replace(/\D/g, ''), // Remove formatação do CPF
          phone: `${data.countryCode}${data.areaCode}${data.phoneNumber}`,
          address: data.address,
          addressNumber: data.addressNumber,
          addressComplement: data.addressComplement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode.replace(/\D/g, '') // Remove formatação do CEP
        }
      );

      if (userId) {
        toast.success('Aluno cadastrado com sucesso pelo administrador!');
        // Resetar formulário ou redirecionar conforme necessário
      } else {
        throw new Error('Erro ao criar usuário');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro ao cadastrar aluno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Aluno (Administrador)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Use este formulário para cadastrar novos alunos diretamente pelo painel administrativo.
          </p>
        </CardContent>
      </Card>
      
      <StudentRegistrationForm 
        onSubmit={handleStudentRegistration} 
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminStudentRegistration;
