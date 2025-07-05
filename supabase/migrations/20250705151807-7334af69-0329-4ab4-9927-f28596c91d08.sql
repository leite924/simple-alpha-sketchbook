
-- Modificar a função SQL para receber o admin_user_id como parâmetro
CREATE OR REPLACE FUNCTION public.admin_create_student_profile(
  p_admin_user_id uuid,
  p_id uuid,
  p_email text,
  p_first_name text,
  p_last_name text,
  p_cpf text DEFAULT NULL,
  p_birth_date date DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_address_number text DEFAULT NULL,
  p_address_complement text DEFAULT NULL,
  p_neighborhood text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_postal_code text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Log da tentativa
  RAISE LOG 'admin_create_student_profile: admin_user_id=%, student_email=%', p_admin_user_id, p_email;
  
  -- Verificar se o usuário passado é admin ou super_admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = p_admin_user_id 
    AND role IN ('admin', 'super_admin')
  ) THEN
    RAISE LOG 'Verificação de permissão falhou para user_id: %', p_admin_user_id;
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem cadastrar alunos';
  END IF;

  RAISE LOG 'Permissão verificada com sucesso para admin: %', p_admin_user_id;

  -- Verificar se já existe um perfil com este email
  SELECT id INTO v_user_id 
  FROM public.profiles 
  WHERE email = p_email;

  IF v_user_id IS NOT NULL THEN
    RAISE LOG 'Atualizando perfil existente: %', v_user_id;
    -- Atualizar perfil existente
    UPDATE public.profiles SET
      first_name = p_first_name,
      last_name = p_last_name,
      cpf = p_cpf,
      birth_date = p_birth_date,
      phone = p_phone,
      address = p_address,
      address_number = p_address_number,
      address_complement = p_address_complement,
      neighborhood = p_neighborhood,
      city = p_city,
      state = p_state,
      postal_code = p_postal_code,
      updated_at = now()
    WHERE id = v_user_id;
    
    RETURN v_user_id;
  ELSE
    RAISE LOG 'Criando novo perfil: %', p_id;
    -- Criar novo perfil
    INSERT INTO public.profiles (
      id, email, first_name, last_name, cpf, birth_date, phone,
      address, address_number, address_complement, neighborhood, 
      city, state, postal_code
    ) VALUES (
      p_id, p_email, p_first_name, p_last_name, p_cpf, p_birth_date, p_phone,
      p_address, p_address_number, p_address_complement, p_neighborhood,
      p_city, p_state, p_postal_code
    );
    
    RETURN p_id;
  END IF;
END;
$$;
