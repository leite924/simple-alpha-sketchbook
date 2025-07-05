
-- Primeiro, vamos garantir que a tabela super_admins existe corretamente
DROP TABLE IF EXISTS public.super_admins CASCADE;

-- Recriar a tabela super_admins
CREATE TABLE public.super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    permissions JSONB DEFAULT '{"all": true, "system_access": true, "user_management": true, "content_management": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Habilitar RLS
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;

-- Política para super admins acessarem seus próprios dados
CREATE POLICY "Super admins can manage their own data" ON public.super_admins
    FOR ALL USING (auth.uid() = user_id);

-- Recriar a função para verificar se é super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.super_admins 
        WHERE user_id = $1 AND is_active = true
    );
$$;

-- Recriar a função para criar super admin automaticamente
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
        
        -- Inserir role de super_admin se a tabela user_roles existir
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'super_admin'::user_role_enum)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created_super_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_super_admin
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_super_admin_on_signup();
