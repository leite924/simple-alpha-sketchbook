
-- Remover TODAS as políticas problemáticas que causam recursão infinita
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update own roles in specific cases" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can manage all user roles" ON public.user_roles;

-- Manter apenas as políticas essenciais e seguras
-- Política para permitir que usuários vejam seus próprios roles (já existe e funciona)
CREATE POLICY "Users can view their own roles" 
ON public.user_roles
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Política para permitir que o sistema insira roles durante signup (já existe e funciona)
CREATE POLICY "Allow system to insert user roles during signup" 
ON public.user_roles
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Política específica e segura para o super admin gerenciar roles
-- Usando verificação direta por email para evitar recursão
CREATE POLICY "Super admin can manage all user roles" 
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
