
// Tipos específicos para interação com o Supabase
export interface RolePermission {
  role: string;
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  cpf: string | null;
  birth_date: string | null;
  phone: string | null;
  address: string | null;
  address_number: string | null;
  address_complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserRole {
  user_id: string;
  role: string;
}

export interface Course {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  is_active: boolean | null;
}

export interface Class {
  id: string;
  course_id: string | null;
  course_name: string;
  period: string;
  days: string;
  total_spots: number;
  spots_available: number;
  price: number;
  is_active: boolean | null;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  current_uses: number | null;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean | null;
  created_at: string | null;
  created_by: string | null;
  course_id: string | null;
}

export interface ManualEnrollment {
  id: string;
  student_id: string;
  class_id: string;
  payment_status: string;
  enrollment_date: string | null;
  created_by: string | null;
  coupon_id: string | null;
  payment_amount: number;
  original_amount: number;
  discount_amount: number | null;
  notes: string | null;
}

export interface Transaction {
  id: string;
  description: string;
  type: string;
  amount: number;
  transaction_date: string;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  status: string | null;
  author_id: string | null;
  categories: string[] | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
  published_at: string | null;
}

export interface AISettings {
  id: string;
  provider: string | null;
  model: string | null;
  api_key: string | null;
  last_updated: string | null;
  updated_by: string | null;
}
