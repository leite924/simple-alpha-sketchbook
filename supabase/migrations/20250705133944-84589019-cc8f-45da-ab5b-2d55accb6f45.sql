
-- SOLUÇÃO DEFINITIVA: Limpeza completa e recriação das políticas RLS
-- Desabilitar RLS temporariamente para garantir limpeza completa
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Remover TODAS as políticas existentes forçadamente
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Users can update own roles in specific cases" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Super admins can manage all user roles" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Super admin can manage all user roles" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles CASCADE;
DROP POLICY IF EXISTS "Allow system to insert user roles during signup" ON public.user_roles CASCADE;

-- Reabilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Criar políticas completamente novas com nomes únicos
-- Política 1: Visualização própria (essencial)
CREATE POLICY "user_roles_select_own_v2" 
ON public.user_roles
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Política 2: Inserção durante signup (essencial)
CREATE POLICY "user_roles_insert_signup_v2" 
ON public.user_roles
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Política 3: Super admin total (sem recursão)
CREATE POLICY "user_roles_superadmin_all_v2" 
ON public.user_roles
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'midiaputz@gmail.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'midiaputz@gmail.com'
  )
);

-- Garantir que Elienai tenha role de admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM public.profiles 
WHERE email = 'elienaitorres@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
