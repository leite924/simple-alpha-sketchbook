
import * as z from 'zod';

export const couponSchema = z.object({
  code: z.string().min(3, 'O código deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed_amount']),
  discount_value: z.union([z.string(), z.number()])
    .transform(val => typeof val === 'string' ? parseFloat(val) : val)
    .refine(val => parseFloat(String(val)) > 0, 'O valor deve ser maior que zero'),
  max_uses: z.union([z.string(), z.number()]).optional()
    .transform(val => typeof val === 'string' && val ? parseInt(val) : val)
    .refine(val => !val || parseFloat(String(val)) > 0, 'O número máximo de usos deve ser maior que zero'),
  valid_from: z.string(),
  valid_until: z.string().optional(),
  is_active: z.boolean().default(true),
  course_id: z.string().optional(),
  minimum_purchase: z.union([z.string(), z.number()]).optional()
    .transform(val => typeof val === 'string' && val ? parseFloat(val) : val)
    .refine(val => !val || parseFloat(String(val)) >= 0, 'O valor mínimo de compra deve ser maior ou igual a zero')
});

export type CouponFormSchema = z.infer<typeof couponSchema>;
