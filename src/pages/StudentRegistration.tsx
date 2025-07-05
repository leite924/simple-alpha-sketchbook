
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import StudentRegistrationForm from '@/components/student/StudentRegistrationForm';
import { createUser } from '@/services/profileService';
import { toast } from 'sonner';

const StudentRegistration = () => {
  const navigate = useNavigate();

  const handleStudentRegistration = async (data: any) => {
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
        toast.success('Aluno cadastrado com sucesso!');
        navigate('/admin');
      } else {
        throw new Error('Erro ao criar usuário');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro ao cadastrar aluno. Tente novamente.');
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
          
          <StudentRegistrationForm onSubmit={handleStudentRegistration} />
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentRegistration;
