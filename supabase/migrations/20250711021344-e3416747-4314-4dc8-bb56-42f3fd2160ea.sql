
-- Criar tabela específica para transações de pagamento do Pagarme
CREATE TABLE public.payment_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  pagarme_transaction_id text NOT NULL UNIQUE,
  status text NOT NULL,
  amount numeric NOT NULL,
  method text NOT NULL, -- 'credit_card', 'pix', 'boleto'
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  card_brand text,
  installments integer,
  pix_qr_code text,
  pix_code text,
  boleto_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para que usuários vejam apenas suas próprias transações
CREATE POLICY "Users can view their own payment transactions" 
  ON public.payment_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment transactions" 
  ON public.payment_transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Admins podem ver todas as transações
CREATE POLICY "Admins can view all payment transactions" 
  ON public.payment_transactions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  ));

-- Índices para performance
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_pagarme_id ON public.payment_transactions(pagarme_transaction_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_payment_transactions_created_at ON public.payment_transactions(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_payment_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER payment_transactions_updated_at
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_transactions_updated_at();
