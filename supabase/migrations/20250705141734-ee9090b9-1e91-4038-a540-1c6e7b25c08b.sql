
-- Adicionar política para super admins verem todos os perfis
CREATE POLICY "Super admins can view all profiles" 
ON public.profiles
FOR SELECT 
TO authenticated
USING (public.is_current_user_super_admin());

-- Adicionar política para admins verem todos os perfis
CREATE POLICY "Admins can view all profiles" 
ON public.profiles
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);
