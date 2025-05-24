
import { z } from 'zod';

export const checkoutSchema = z.object({
  firstName: z.string().min(2, { message: "Nome é obrigatório" }),
  lastName: z.string().min(2, { message: "Sobrenome é obrigatório" }),
  email: z.string().email({ message: "E-mail inválido" }),
  cpf: z.string().min(11, { message: "CPF inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
  address: z.string().min(3, { message: "Endereço é obrigatório" }),
  addressNumber: z.string().min(1, { message: "Número é obrigatório" }),
  addressComplement: z.string().optional(),
  neighborhood: z.string().min(2, { message: "Bairro é obrigatório" }),
  city: z.string().min(2, { message: "Cidade é obrigatória" }),
  state: z.string().min(2, { message: "Estado é obrigatório" }),
  postalCode: z.string().min(8, { message: "CEP inválido" }),
  paymentMethod: z.enum(['credit_card', 'pix', 'bank_slip']),
  cardNumber: z.string().optional(),
  cardHolderName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  installments: z.number().optional(),
  classId: z.string(),
  couponCode: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "Você precisa concordar com os termos e condições"
  })
});
