
-- Função administrativa para excluir usuário por email
CREATE OR REPLACE FUNCTION admin_delete_user_by_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Buscar o UUID do usuário pelo email
    SELECT id INTO user_uuid 
    FROM profiles 
    WHERE email = user_email;
    
    -- Se não encontrou o usuário, retornar false
    IF user_uuid IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Excluir roles do usuário
    DELETE FROM user_roles WHERE user_id = user_uuid;
    
    -- Excluir o perfil do usuário
    DELETE FROM profiles WHERE id = user_uuid;
    
    RETURN TRUE;
END;
$$;
