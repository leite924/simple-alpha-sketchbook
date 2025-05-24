import { User } from "@/components/admin/types";

export type DiscountType = 'percentage' | 'fixed_amount';

export interface DiscountCoupon {
  id: string;
  code: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  max_uses?: number;
  current_uses: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
  course_id?: string;
  minimum_purchase?: number;
}

export interface DiscountCouponFormValues {
  code: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number | string;
  max_uses?: number | string;
  valid_from: string;
  valid_until?: string;
  is_active?: boolean;
  course_id?: string;
  minimum_purchase?: number | string;
}

export interface ManualEnrollment {
  id: string;
  student_id: string;
  class_id: string;
  payment_status: 'pending' | 'paid' | 'overdue' | 'canceled';
  enrollment_date: string;
  created_by: string;
  coupon_id?: string;
  payment_amount: number;
  original_amount: number;
  discount_amount?: number;
  notes?: string;
}

export interface ManualEnrollmentFormValues {
  student_id: string;
  class_id: string;
  payment_status: 'pending' | 'paid' | 'overdue' | 'canceled';
  coupon_id?: string;
  payment_amount: number | string;
  original_amount: number | string;
  discount_amount?: number | string;
  notes?: string;
}

// Interface estendida para exibição na tabela (com dados relacionados)
export interface EnrollmentWithDetails extends ManualEnrollment {
  student_name?: string;
  class_name?: string;
  course_name?: string;
  coupon_code?: string;
}

import { z } from "zod";

// Form validation schema
export const enrollmentSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
