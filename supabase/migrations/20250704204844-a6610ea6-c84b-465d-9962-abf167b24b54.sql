
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  cpf TEXT,
  birth_date DATE,
  phone TEXT,
  address TEXT,
  address_number TEXT,
  address_complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles table
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'instructor', 'student', 'viewer');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create role permissions table
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  module TEXT NOT NULL,
  can_view BOOLEAN DEFAULT FALSE,
  can_create BOOLEAN DEFAULT FALSE,
  can_edit BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, module)
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id),
  course_name TEXT NOT NULL,
  period TEXT NOT NULL,
  days TEXT NOT NULL,
  total_spots INTEGER NOT NULL DEFAULT 0,
  spots_available INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discount coupons table
CREATE TABLE public.discount_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from DATE NOT NULL,
  valid_until DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES public.courses(id)
);

-- Create manual enrollments table
CREATE TABLE public.manual_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) NOT NULL,
  class_id UUID REFERENCES public.classes(id) NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'overdue', 'canceled')),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  coupon_id UUID REFERENCES public.discount_coupons(id),
  payment_amount DECIMAL(10,2) NOT NULL,
  original_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI settings table
CREATE TABLE public.ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT,
  model TEXT,
  api_key TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reference_id UUID,
  reference_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES auth.users(id),
  categories TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (you can customize these later)
-- Profiles: users can view and edit their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User roles: users can view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Role permissions: authenticated users can view permissions
CREATE POLICY "Authenticated users can view permissions" ON public.role_permissions FOR SELECT USING (auth.role() = 'authenticated');

-- Courses and classes: public read access
CREATE POLICY "Public can view active courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active classes" ON public.classes FOR SELECT USING (is_active = true);

-- Blog posts: public can view published posts
CREATE POLICY "Public can view published posts" ON public.blog_posts FOR SELECT USING (status = 'published');

-- Insert some basic role permissions data
INSERT INTO public.role_permissions (role, module, can_view, can_create, can_edit, can_delete) VALUES
('super_admin', 'users', true, true, true, true),
('super_admin', 'courses', true, true, true, true),
('super_admin', 'classes', true, true, true, true),
('super_admin', 'enrollments', true, true, true, true),
('super_admin', 'finance', true, true, true, true),
('super_admin', 'blog', true, true, true, true),
('super_admin', 'ai', true, true, true, true),
('admin', 'users', true, true, true, false),
('admin', 'courses', true, true, true, true),
('admin', 'classes', true, true, true, true),
('admin', 'enrollments', true, true, true, true),
('admin', 'finance', true, true, true, false),
('admin', 'blog', true, true, true, true),
('viewer', 'courses', true, false, false, false),
('viewer', 'classes', true, false, false, false),
('student', 'courses', true, false, false, false),
('student', 'classes', true, false, false, false),
('instructor', 'courses', true, false, false, false),
('instructor', 'classes', true, true, true, false);

-- Create RPC functions for AI settings
CREATE OR REPLACE FUNCTION public.get_ai_settings()
RETURNS TABLE (
  provider TEXT,
  model TEXT,
  api_key TEXT,
  last_updated TIMESTAMP WITH TIME ZONE,
  updated_by UUID
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT provider, model, api_key, last_updated, updated_by
  FROM public.ai_settings
  ORDER BY last_updated DESC
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.update_ai_settings(
  p_provider TEXT,
  p_model TEXT,
  p_api_key TEXT
)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  INSERT INTO public.ai_settings (provider, model, api_key, updated_by)
  VALUES (p_provider, p_model, p_api_key, auth.uid())
  ON CONFLICT (id) DO UPDATE SET
    provider = p_provider,
    model = p_model,
    api_key = p_api_key,
    last_updated = NOW(),
    updated_by = auth.uid();
$$;

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
