
-- Remover as políticas RLS problemáticas que causam recursão infinita
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update own roles in specific cases" ON public.user_roles;

-- Manter apenas as políticas essenciais e seguras
-- Política para permitir que usuários vejam seus próprios roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Política para permitir que o sistema insira roles durante signup (já existe)
-- Esta política já permite INSERT durante o signup sem problemas de recursão

-- Política simples para permitir que super_admins gerenciem roles
-- Usando verificação direta por email para evitar recursão
CREATE POLICY "Super admins can manage all user roles" 
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
