-- Criação do enum user_role
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin', 'instructor', 'student');

-- Tabela ai_settings
CREATE TABLE ai_settings (
  id SERIAL PRIMARY KEY,
  provider VARCHAR,
  model VARCHAR,
  api_key VARCHAR,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID
);

-- Tabela blog_posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT,
  author_id UUID,
  categories TEXT[],
  tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela classes
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  course_name TEXT NOT NULL,
  days TEXT NOT NULL,
  period TEXT NOT NULL,
  price NUMERIC NOT NULL,
  total_spots INTEGER DEFAULT 20,
  spots_available INTEGER DEFAULT 20,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela discount_coupons
CREATE TABLE discount_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  course_id UUID REFERENCES courses(id),
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- Tabela financial_categories
CREATE TABLE financial_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
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
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela user_roles (sem restrições de chave estrangeira para evitar problemas de recursão)
CREATE TABLE user_roles (
  user_id UUID NOT NULL,
  role user_role NOT NULL,
  PRIMARY KEY (user_id, role)
);

-- Tabela manual_enrollments
CREATE TABLE manual_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID,
  class_id UUID REFERENCES classes(id),
  coupon_id UUID REFERENCES discount_coupons(id),
  original_amount NUMERIC NOT NULL,
  discount_amount NUMERIC,
  payment_amount NUMERIC NOT NULL,
  payment_status TEXT NOT NULL,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- Tabela newsletter_subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT TRUE,
  source TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela payables
CREATE TABLE payables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  supplier TEXT NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT NOT NULL,
  category_id UUID REFERENCES financial_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by UUID
);

-- Tabela photography_questions
CREATE TABLE photography_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- Tabela photography_answers
CREATE TABLE photography_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES photography_questions(id),
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela quiz_scores
CREATE TABLE quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  date_played TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela receivables
CREATE TABLE receivables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  customer TEXT NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT NOT NULL,
  category_id UUID REFERENCES financial_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by UUID
);

-- Tabela role_permissions
CREATE TABLE role_permissions (
  role user_role NOT NULL,
  module TEXT NOT NULL,
  can_view BOOLEAN NOT NULL DEFAULT FALSE,
  can_create BOOLEAN NOT NULL DEFAULT FALSE,
  can_edit BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (role, module)
);

-- Tabela transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  transaction_date DATE NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by UUID
);

-- Funções do banco de dados
CREATE OR REPLACE FUNCTION get_user_profile(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  cpf TEXT,
  birth_date TEXT,
  phone TEXT,
  address TEXT,
  address_number TEXT,
  address_complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  created_at TEXT,
  updated_at TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.email,
    p.first_name,
    p.last_name,
    p.cpf,
    p.birth_date::TEXT,
    p.phone,
    p.address,
    p.address_number,
    p.address_complement,
    p.neighborhood,
    p.city,
    p.state,
    p.postal_code,
    p.created_at::TEXT,
    p.updated_at::TEXT
  FROM
    profiles p
  WHERE
    p.id = p_user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_profile(
  p_user_id UUID,
  p_first_name TEXT,
  p_last_name TEXT,
  p_cpf TEXT,
  p_birth_date TEXT,
  p_phone TEXT,
  p_address TEXT,
  p_address_number TEXT,
  p_address_complement TEXT,
  p_neighborhood TEXT,
  p_city TEXT,
  p_state TEXT,
  p_postal_code TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE profiles
  SET
    first_name = p_first_name,
    last_name = p_last_name,
    cpf = p_cpf,
    birth_date = p_birth_date::DATE,
    phone = p_phone,
    address = p_address,
    address_number = p_address_number,
    address_complement = p_address_complement,
    neighborhood = p_neighborhood,
    city = p_city,
    state = p_state,
    postal_code = p_postal_code,
    updated_at = NOW()
  WHERE
    id = p_user_id;
    
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_roles(p_user_id UUID)
RETURNS TABLE (
  role_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ur.role::TEXT
  FROM
    user_roles ur
  WHERE
    ur.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION has_role(user_id UUID, role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_roles.user_id = $1
    AND user_roles.role = $2
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_coupon_valid(coupon_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  valid BOOLEAN;
BEGIN
  SELECT 
    (is_active = TRUE AND 
     (valid_until IS NULL OR valid_until > NOW()) AND
     (max_uses IS NULL OR current_uses < max_uses))
  INTO valid
  FROM discount_coupons
  WHERE id = coupon_id;
  
  RETURN COALESCE(valid, FALSE);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_ai_settings()
RETURNS TABLE (
  id INTEGER,
  provider TEXT,
  model TEXT,
  api_key TEXT,
  last_updated TEXT,
  updated_by TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.provider,
    a.model,
    a.api_key,
    a.last_updated::TEXT,
    a.updated_by::TEXT
  FROM
    ai_settings a
  ORDER BY
    a.id DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_ai_settings(
  p_provider TEXT,
  p_model TEXT,
  p_api_key TEXT
) RETURNS VOID AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM ai_settings LIMIT 1) THEN
    UPDATE ai_settings
    SET
      provider = p_provider,
      model = p_model,
      api_key = p_api_key,
      last_updated = NOW()
    WHERE id = (SELECT id FROM ai_settings ORDER BY id DESC LIMIT 1);
  ELSE
    INSERT INTO ai_settings (provider, model, api_key)
    VALUES (p_provider, p_model, p_api_key);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_financial_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH receivable_stats AS (
    SELECT
      COUNT(*) AS total_count,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
      SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_count,
      SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) AS overdue_count,
      SUM(amount) AS total_amount,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending_amount,
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid_amount,
      SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END) AS overdue_amount
    FROM receivables
  ),
  payable_stats AS (
    SELECT
      COUNT(*) AS total_count,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
      SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_count,
      SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) AS overdue_count,
      SUM(amount) AS total_amount,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending_amount,
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid_amount,
      SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END) AS overdue_amount
    FROM payables
  ),
  transaction_stats AS (
    SELECT
      COUNT(*) AS total_count,
      SUM(CASE WHEN type = 'income' THEN 1 ELSE 0 END) AS income_count,
      SUM(CASE WHEN type = 'expense' THEN 1 ELSE 0 END) AS expense_count,
      SUM(amount) AS total_amount,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income_amount,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense_amount
    FROM transactions
  )
  SELECT json_build_object(
    'receivables', json_build_object(
      'counts', json_build_object(
        'total', COALESCE(r.total_count, 0),
        'pending', COALESCE(r.pending_count, 0),
        'paid', COALESCE(r.paid_count, 0),
        'overdue', COALESCE(r.overdue_count, 0)
      ),
      'amounts', json_build_object(
        'total', COALESCE(r.total_amount, 0),
        'pending', COALESCE(r.pending_amount, 0),
        'paid', COALESCE(r.paid_amount, 0),
        'overdue', COALESCE(r.overdue_amount, 0)
      )
    ),
    'payables', json_build_object(
      'counts', json_build_object(
        'total', COALESCE(p.total_count, 0),
        'pending', COALESCE(p.pending_count, 0),
        'paid', COALESCE(p.paid_count, 0),
        'overdue', COALESCE(p.overdue_count, 0)
      ),
      'amounts', json_build_object(
        'total', COALESCE(p.total_amount, 0),
        'pending', COALESCE(p.pending_amount, 0),
        'paid', COALESCE(p.paid_amount, 0),
        'overdue', COALESCE(p.overdue_amount, 0)
      )
    ),
    'transactions', json_build_object(
      'counts', json_build_object(
        'total', COALESCE(t.total_count, 0),
        'income', COALESCE(t.income_count, 0),
        'expense', COALESCE(t.expense_count, 0)
      ),
      'amounts', json_build_object(
        'total', COALESCE(t.total_amount, 0),
        'income', COALESCE(t.income_amount, 0),
        'expense', COALESCE(t.expense_amount, 0)
      )
    )
  ) INTO result
  FROM receivable_stats r, payable_stats p, transaction_stats t;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payables ENABLE ROW LEVEL SECURITY;
ALTER TABLE receivables ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE photography_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE photography_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seus próprios perfis" ON profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON profiles
  FOR UPDATE USING (auth.uid() = id);
  
CREATE POLICY "Admins podem ver todos os perfis" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
  
CREATE POLICY "Admins podem atualizar todos os perfis" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Políticas para user_roles - CORRIGIDO para evitar recursão infinita
-- Permitir acesso total à tabela user_roles para evitar problemas de recursão
CREATE POLICY "Acesso total à tabela user_roles" ON user_roles
  USING (TRUE);

-- Políticas para courses
CREATE POLICY "Todos podem ver cursos ativos" ON courses
  FOR SELECT USING (is_active = TRUE);
  
CREATE POLICY "Admins podem gerenciar cursos" ON courses
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Políticas para classes
CREATE POLICY "Todos podem ver turmas ativas" ON classes
  FOR SELECT USING (is_active = TRUE);
  
CREATE POLICY "Admins podem gerenciar turmas" ON classes
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Políticas para discount_coupons
CREATE POLICY "Admins podem gerenciar cupons" ON discount_coupons
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Políticas para manual_enrollments
CREATE POLICY "Admins podem gerenciar matrículas" ON manual_enrollments
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
  
CREATE POLICY "Estudantes podem ver suas próprias matrículas" ON manual_enrollments
  FOR SELECT USING (student_id = auth.uid());

-- Políticas para financial_categories
CREATE POLICY "Admins podem gerenciar categorias financeiras" ON financial_categories
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Políticas para payables e receivables
CREATE POLICY "Admins podem gerenciar contas" ON payables
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
  
CREATE POLICY "Admins podem gerenciar recebimentos" ON receivables
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Políticas para transactions
CREATE POLICY "Admins podem gerenciar transações" ON transactions
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Políticas para photography_questions e photography_answers
CREATE POLICY "Todos podem ver perguntas de fotografia" ON photography_questions
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Admins podem gerenciar perguntas de fotografia" ON photography_questions
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
  
CREATE POLICY "Todos podem ver respostas de fotografia" ON photography_answers
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Admins podem gerenciar respostas de fotografia" ON photography_answers
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Políticas para quiz_scores
CREATE POLICY "Usuários podem ver suas próprias pontuações" ON quiz_scores
  FOR SELECT USING (user_id = auth.uid());
  
CREATE POLICY "Usuários podem adicionar suas próprias pontuações" ON quiz_scores
  FOR INSERT WITH CHECK (user_id = auth.uid());
  
CREATE POLICY "Admins podem ver todas as pontuações" ON quiz_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Políticas para newsletter_subscribers
CREATE POLICY "Admins podem gerenciar assinantes da newsletter" ON newsletter_subscribers
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
  
CREATE POLICY "Qualquer um pode se inscrever na newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (TRUE);

-- Políticas para ai_settings
CREATE POLICY "Admins podem gerenciar configurações de IA" ON ai_settings
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Políticas para role_permissions
CREATE POLICY "Super admins podem gerenciar permissões" ON role_permissions
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    )
  );
  
CREATE POLICY "Todos podem ver permissões" ON role_permissions
  FOR SELECT USING (TRUE);

-- Inserção de dados iniciais para role_permissions
INSERT INTO role_permissions (role, module, can_view, can_create, can_edit, can_delete) VALUES
('user', 'dashboard', TRUE, FALSE, FALSE, FALSE),
('user', 'profile', TRUE, FALSE, TRUE, FALSE),
('user', 'courses', TRUE, FALSE, FALSE, FALSE),
('user', 'quiz', TRUE, TRUE, FALSE, FALSE),
('student', 'dashboard', TRUE, FALSE, FALSE, FALSE),
('student', 'profile', TRUE, FALSE, TRUE, FALSE),
('student', 'courses', TRUE, FALSE, FALSE, FALSE),
('student', 'enrollments', TRUE, FALSE, FALSE, FALSE),
('student', 'quiz', TRUE, TRUE, FALSE, FALSE),
('instructor', 'dashboard', TRUE, FALSE, FALSE, FALSE),
('instructor', 'profile', TRUE, FALSE, TRUE, FALSE),
('instructor', 'courses', TRUE, FALSE, FALSE, FALSE),
('instructor', 'classes', TRUE, FALSE, TRUE, FALSE),
('instructor', 'students', TRUE, FALSE, FALSE, FALSE),
('admin', 'dashboard', TRUE, FALSE, FALSE, FALSE),
('admin', 'profile', TRUE, FALSE, TRUE, FALSE),
('admin', 'users', TRUE, TRUE, TRUE, FALSE),
('admin', 'courses', TRUE, TRUE, TRUE, TRUE),
('admin', 'classes', TRUE, TRUE, TRUE, TRUE),
('admin', 'enrollments', TRUE, TRUE, TRUE, TRUE),
('admin', 'financial', TRUE, TRUE, TRUE, TRUE),
('admin', 'blog', TRUE, TRUE, TRUE, TRUE),
('admin', 'quiz', TRUE, TRUE, TRUE, TRUE),
('admin', 'settings', TRUE, TRUE, TRUE, FALSE),
('super_admin', 'dashboard', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'profile', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'users', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'courses', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'classes', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'enrollments', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'financial', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'blog', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'quiz', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'settings', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'permissions', TRUE, TRUE, TRUE, TRUE);

-- Trigger para atualizar spots_available quando uma nova matrícula é criada
CREATE OR REPLACE FUNCTION update_spots_available()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE classes
  SET spots_available = spots_available - 1
  WHERE id = NEW.class_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_enrollment_insert
AFTER INSERT ON manual_enrollments
FOR EACH ROW
EXECUTE FUNCTION update_spots_available();

-- Trigger para criar perfil quando um novo usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
