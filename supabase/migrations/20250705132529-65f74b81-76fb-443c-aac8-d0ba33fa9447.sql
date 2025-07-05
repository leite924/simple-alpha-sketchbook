
-- Inserir role de admin para Elienai Torres na tabela user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM public.profiles 
WHERE email = 'elienaitorres@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
