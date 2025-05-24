
import * as z from 'zod';

export const enrollmentSchema = z.object({
  student_id: z.string().uuid('ID do estudante inválido'),
  class_id: z.string().uuid('ID da turma inválido'),
  payment_status: z.enum(['pending', 'paid', 'overdue', 'canceled']),
  coupon_id: z.string().optional(),
  payment_amount: z.union([z.string(), z.number()])
    .transform(val => typeof val === 'string' ? parseFloat(val) : val)
    .refine(val => !isNaN(Number(val)) && Number(val) >= 0, 'O valor deve ser maior ou igual a zero'),
  original_amount: z.union([z.string(), z.number()])
    .transform(val => typeof val === 'string' ? parseFloat(val) : val)
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, 'O valor deve ser maior que zero'),
  discount_amount: z.union([z.string(), z.number(), z.null()]).optional()
    .transform(val => typeof val === 'string' && val ? parseFloat(val) : (val || 0))
    .refine(val => val === undefined || val === null || (typeof val === 'number' && !isNaN(val) && val >= 0), 
      'O valor do desconto deve ser maior ou igual a zero'),
  notes: z.string().optional(),
});

export type EnrollmentFormSchema = z.infer<typeof enrollmentSchema>;
