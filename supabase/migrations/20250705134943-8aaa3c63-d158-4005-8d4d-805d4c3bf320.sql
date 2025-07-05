
-- CORREÇÃO DEFINITIVA: Criar função SECURITY DEFINER para eliminar erros de permissão
-- Função segura para verificar email do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS TEXT AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Função segura para verificar se é super admin
CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'midiaputz@gmail.com'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Remover políticas atuais que causam problemas
DROP POLICY IF EXISTS "user_roles_superadmin_all_v2" ON public.user_roles;

-- Criar nova política usando a função segura
CREATE POLICY "user_roles_superadmin_all_v3" 
ON public.user_roles
FOR ALL 
TO authenticated
USING (public.is_current_user_super_admin())
WITH CHECK (public.is_current_user_super_admin());

-- Garantir que as roles essenciais existem
DO $$
DECLARE
    midiaputz_id UUID;
    elienai_id UUID;
BEGIN
    -- Buscar ID do midiaputz
    SELECT id INTO midiaputz_id FROM public.profiles WHERE email = 'midiaputz@gmail.com';
    
    -- Buscar ID da elienai
    SELECT id INTO elienai_id FROM public.profiles WHERE email = 'elienaitorres@gmail.com';
    
    -- Inserir role de super_admin para midiaputz se existir
    IF midiaputz_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (midiaputz_id, 'super_admin'::public.app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
    
    -- Inserir role de admin para elienai se existir
    IF elienai_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (elienai_id, 'admin'::public.app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;
