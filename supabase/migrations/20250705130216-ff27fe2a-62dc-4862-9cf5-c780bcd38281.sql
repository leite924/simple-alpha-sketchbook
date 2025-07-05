
-- Primeiro, criar o enum app_role se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'instructor', 'student', 'viewer');
    END IF;
END $$;

-- Atualizar a função para usar o enum correto ou text simples
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
        
        -- Inserir role de super_admin usando cast explícito
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'super_admin'::public.app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$;
