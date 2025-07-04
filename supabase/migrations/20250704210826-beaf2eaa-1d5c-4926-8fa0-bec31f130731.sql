
-- Adicionar campos author e read_time à tabela blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS read_time TEXT;

-- Atualizar os posts existentes com valores padrão
UPDATE public.blog_posts 
SET 
  author = 'Marina Silva',
  read_time = '5 min'
WHERE author IS NULL OR read_time IS NULL;
