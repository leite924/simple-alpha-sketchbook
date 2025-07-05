
-- Criar enum para tipos de usuário com super_admin
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('viewer', 'admin', 'super_admin', 'instructor', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar tabela de super admins (separada e especial)
CREATE TABLE IF NOT EXISTS public.super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    permissions JSONB DEFAULT '{"all": true, "system_access": true, "user_management": true, "content_management": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Habilitar RLS na tabela super_admins
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;

-- Política para super admins acessarem seus próprios dados
CREATE POLICY "Super admins can manage their own data" ON public.super_admins
    FOR ALL USING (auth.uid() = user_id);

-- Atualizar tabela user_roles para usar o enum
ALTER TABLE public.user_roles 
ALTER COLUMN role TYPE user_role_enum USING role::user_role_enum;

-- Função para verificar se é super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.super_admins 
        WHERE user_id = $1 AND is_active = true
    );
$$;

-- Função para criar super admin automaticamente
CREATE OR REPLACE FUNCTION public.create_super_admin_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    -- Verificar se é o email especial do super admin
    IF NEW.email = 'midiaputz@gmail.com' THEN
        -- Inserir na tabela super_admins
        INSERT INTO public.super_admins (user_id, email, is_active)
        VALUES (NEW.id, NEW.email, true);
        
        -- Inserir role de super_admin
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'super_admin'::user_role_enum);
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger para criar super admin automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created_super_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_super_admin
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_super_admin_on_signup();

-- Inserir dados do super admin se não existir
DO $$
BEGIN
    -- Primeiro, tentar criar o usuário na autenticação (se não existir)
    -- Isso normalmente seria feito via signup, mas vamos preparar a estrutura
    
    -- Se o usuário já existe, garantir que tem os privilégios corretos
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'midiaputz@gmail.com') THEN
        -- Obter o user_id
        WITH user_data AS (
            SELECT id FROM auth.users WHERE email = 'midiaputz@gmail.com'
        )
        -- Inserir na tabela super_admins se não existir
        INSERT INTO public.super_admins (user_id, email, is_active)
        SELECT id, 'midiaputz@gmail.com', true
        FROM user_data
        WHERE NOT EXISTS (
            SELECT 1 FROM public.super_admins 
            WHERE email = 'midiaputz@gmail.com'
        );
        
        -- Inserir role se não existir
        WITH user_data AS (
            SELECT id FROM auth.users WHERE email = 'midiaputz@gmail.com'
        )
        INSERT INTO public.user_roles (user_id, role)
        SELECT id, 'super_admin'::user_role_enum
        FROM user_data
        WHERE NOT EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = (SELECT id FROM auth.users WHERE email = 'midiaputz@gmail.com')
            AND role = 'super_admin'::user_role_enum
        );
    END IF;
END $$;
