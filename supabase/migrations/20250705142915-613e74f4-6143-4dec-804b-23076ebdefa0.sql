
-- Criar função para verificar se o usuário atual é super admin
CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.super_admins 
    WHERE user_id = auth.uid() 
    AND is_active = true
  ) OR auth.email() = 'midiaputz@gmail.com';
$$;

-- Criar trigger para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar perfil do usuário
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );

  -- Se for o email do super admin, criar entrada na tabela super_admins
  IF NEW.email = 'midiaputz@gmail.com' THEN
    INSERT INTO public.super_admins (user_id, email, is_active)
    VALUES (NEW.id, NEW.email, true)
    ON CONFLICT (email) DO UPDATE SET
      user_id = NEW.id,
      is_active = true,
      updated_at = now();
      
    -- Adicionar role de super_admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- Para outros usuários, adicionar role padrão de viewer
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'viewer')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Criar trigger que executa quando um novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Política para permitir inserção inicial de perfis durante o signup
CREATE POLICY "Allow profile creation during signup" 
ON public.profiles
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);
