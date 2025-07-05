
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import StudentRegistrationForm from '@/components/student/StudentRegistrationForm';
import { createUserAsAdmin } from '@/services/profileService';
import { toast } from 'sonner';

const AdminStudentRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStudentRegistration = async (data: any) => {
    console.log('🎯 Admin: Iniciando cadastro de aluno:', data);
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!data.fullName || !data.email || !data.cpf) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      // Split full name into first and last name
      const nameParts = data.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';
      
      console.log('📝 Nome processado:', { firstName, lastName });
      
      // Prepare profile data
      const profileData = {
        cpf: data.cpf.replace(/\D/g, ''), // Remove formatting
        phone: `${data.countryCode}${data.areaCode}${data.phoneNumber}`,
        address: data.address,
        addressNumber: data.addressNumber,
        addressComplement: data.addressComplement || null,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode.replace(/\D/g, '') // Remove formatting
      };
      
      console.log('📊 Profile data preparado:', profileData);

      const userId = await createUserAsAdmin(
        data.email.trim().toLowerCase(),
        firstName,
        lastName,
        profileData
      );

      if (userId) {
        console.log('✅ Aluno cadastrado/atualizado com sucesso:', userId);
        toast.success('Aluno cadastrado com sucesso pelo administrador!');
      } else {
        console.error('❌ createUserAsAdmin retornou undefined');
        throw new Error('Erro ao processar dados do usuário');
      }
      
    } catch (error) {
      console.error('❌ Erro no cadastro de aluno:', error);
      
      if (error instanceof Error) {
        // Mensagens de erro mais específicas
        if (error.message.includes('permissão') || error.message.includes('Acesso negado')) {
          toast.error('Erro de permissão: Você precisa estar logado como administrador para cadastrar alunos.');
        } else if (error.message.includes('já está cadastrado') || error.message.includes('already exists')) {
          toast.error('Este email já está cadastrado no sistema. Os dados foram atualizados.');
        } else if (error.message.includes('servidor') || error.message.includes('server')) {
          toast.error('Erro do servidor. Tente novamente em alguns instantes.');
        } else {
          toast.error(`Erro no cadastro: ${error.message}`);
        }
        throw error; // Re-throw para o formulário tratar
      } else {
        toast.error('Erro inesperado ao cadastrar aluno');
        throw new Error('Erro inesperado ao cadastrar aluno');
      }
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
            Use este formulário para cadastrar novos alunos ou atualizar dados de alunos existentes.
            <br />
            <small className="text-sm text-blue-600">
              ℹ️ Esta função requer privilégios de administrador
            </small>
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
