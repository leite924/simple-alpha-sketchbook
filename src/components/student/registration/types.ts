
import { z } from 'zod';

export const studentRegistrationSchema = z.object({
  fullName: z.string().min(5, "Nome completo deve ter pelo menos 5 caracteres"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  postalCode: z.string().min(8, "CEP deve ter 8 dígitos").max(9, "CEP inválido"),
  address: z.string().min(5, "Endereço é obrigatório"),
  addressNumber: z.string().min(1, "Número é obrigatório"),
  addressComplement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  countryCode: z.string().min(1, "Código do país é obrigatório"),
  areaCode: z.string().min(2, "DDD é obrigatório"),
  phoneNumber: z.string().min(9, "Número deve ter 9 dígitos").max(9, "Número deve ter 9 dígitos")
});

export type StudentRegistrationFormData = z.infer<typeof studentRegistrationSchema>;

export interface StudentRegistrationFormProps {
  onSubmit: (data: StudentRegistrationFormData) => Promise<void>;
  isLoading?: boolean;
}
