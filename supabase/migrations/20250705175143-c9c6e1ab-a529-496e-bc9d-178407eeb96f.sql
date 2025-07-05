
-- Criar tabela para configurações de NFS-e
CREATE TABLE public.nfse_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_cnpj TEXT NOT NULL,
  company_name TEXT NOT NULL,
  municipal_inscription TEXT,
  service_code TEXT NOT NULL,
  auto_generate BOOLEAN NOT NULL DEFAULT false,
  auto_generate_status TEXT NOT NULL DEFAULT 'completed',
  certificate_file_name TEXT,
  certificate_password_encrypted TEXT,
  certificate_validity DATE,
  webservice_environment TEXT NOT NULL DEFAULT 'homologacao',
  webservice_url_homologacao TEXT DEFAULT 'https://nfse-hom.recife.pe.gov.br/nfse/services',
  webservice_url_producao TEXT DEFAULT 'https://nfse.recife.pe.gov.br/nfse/services',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.nfse_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view their own NFS-e settings"
  ON public.nfse_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own NFS-e settings"
  ON public.nfse_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own NFS-e settings"
  ON public.nfse_settings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all NFS-e settings"
  ON public.nfse_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage all NFS-e settings"
  ON public.nfse_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Função para criptografar senhas
CREATE OR REPLACE FUNCTION public.encrypt_password(password TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT encode(digest(password || 'nfse_salt_key', 'sha256'), 'hex');
$$;

-- Função para buscar configurações ativas do usuário
CREATE OR REPLACE FUNCTION public.get_user_nfse_settings(p_user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  id UUID,
  company_cnpj TEXT,
  company_name TEXT,
  municipal_inscription TEXT,
  service_code TEXT,
  auto_generate BOOLEAN,
  auto_generate_status TEXT,
  certificate_file_name TEXT,
  certificate_validity DATE,
  webservice_environment TEXT,
  webservice_url_homologacao TEXT,
  webservice_url_producao TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    s.id,
    s.company_cnpj,
    s.company_name,
    s.municipal_inscription,
    s.service_code,
    s.auto_generate,
    s.auto_generate_status,
    s.certificate_file_name,
    s.certificate_validity,
    s.webservice_environment,
    s.webservice_url_homologacao,
    s.webservice_url_producao,
    s.created_at,
    s.updated_at
  FROM public.nfse_settings s
  WHERE s.user_id = p_user_id 
    AND s.is_active = true
  ORDER BY s.updated_at DESC
  LIMIT 1;
$$;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_nfse_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_nfse_settings_updated_at
  BEFORE UPDATE ON public.nfse_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_nfse_settings_updated_at();
