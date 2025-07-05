
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import StudentRegistrationForm from '@/components/student/StudentRegistrationForm';
import { createUser } from '@/services/profileService';
import { toast } from 'sonner';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStudentRegistration = async (data: any) => {
    console.log('🎯 Public: Iniciando cadastro de aluno:', data);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!data.fullName || !data.email || !data.cpf) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
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

      const userId = await createUser(
        data.email.trim().toLowerCase(),
        firstName,
        lastName,
        profileData
      );

      if (userId) {
        console.log('✅ Aluno cadastrado com sucesso:', userId);
        toast.success('Aluno cadastrado com sucesso!');
        navigate('/admin');
      } else {
        console.error('❌ createUser retornou undefined');
        toast.error('Erro ao criar usuário - ID não retornado');
      }
      
    } catch (error) {
      console.error('❌ Erro no cadastro de aluno:', error);
      
      if (error instanceof Error) {
        toast.error(`Erro: ${error.message}`);
      } else {
        toast.error('Erro inesperado ao cadastrar aluno');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Cadastro de Aluno</h1>
            <p className="text-gray-600">Preencha todos os campos obrigatórios para cadastrar um novo aluno</p>
          </div>
          
          <StudentRegistrationForm 
            onSubmit={handleStudentRegistration} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentRegistration;
