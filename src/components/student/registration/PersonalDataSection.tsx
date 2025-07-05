
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudentRegistrationFormData } from './types';
import { formatCpf } from './utils';

interface PersonalDataSectionProps {
  register: UseFormRegister<StudentRegistrationFormData>;
  errors: FieldErrors<StudentRegistrationFormData>;
  setValue: UseFormSetValue<StudentRegistrationFormData>;
  isLoading: boolean;
}

const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({
  register,
  errors,
  setValue,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dados Pessoais</h3>
      
      <div>
        <Label htmlFor="fullName">Nome Completo *</Label>
        <Input
          id="fullName"
          {...register("fullName")}
          placeholder="Digite seu nome completo"
          className={errors.fullName ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="cpf">CPF *</Label>
        <Input
          id="cpf"
          {...register("cpf")}
          placeholder="000.000.000-00"
          maxLength={14}
          onChange={(e) => {
            const formatted = formatCpf(e.target.value);
            setValue('cpf', formatted);
          }}
          className={errors.cpf ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.cpf && (
          <p className="text-sm text-red-500 mt-1">{errors.cpf.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="seu@email.com"
          className={errors.email ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalDataSection;
