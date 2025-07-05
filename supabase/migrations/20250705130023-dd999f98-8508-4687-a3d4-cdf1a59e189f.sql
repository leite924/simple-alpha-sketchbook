
-- Recriar o trigger que executa a função quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created_super_admin ON auth.users;

CREATE TRIGGER on_auth_user_created_super_admin
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_super_admin_on_signup();
