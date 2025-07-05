
-- Criar políticas RLS para permitir INSERT na tabela user_roles
-- Política para permitir que funções SECURITY DEFINER inserir roles durante criação de usuário
CREATE POLICY "Allow system to insert user roles during signup" 
ON public.user_roles
FOR INSERT 
TO authenticated, anon
WITH CHECK (true);

-- Política para permitir que admins/super_admins gerenciem roles
CREATE POLICY "Admins can manage user roles" 
ON public.user_roles
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'super_admin')
  )
);

-- Política para permitir UPDATE de roles próprios em casos específicos
CREATE POLICY "Users can update own roles in specific cases" 
ON public.user_roles
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
