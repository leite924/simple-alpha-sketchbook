# Sistema de Banco de Dados - Foto Cursos Inteligente

Este diretório contém todos os arquivos necessários para configurar e gerenciar o banco de dados Supabase do projeto Foto Cursos Inteligente.

## Estrutura de Arquivos

- `config.toml` - Arquivo de configuração do Supabase
- `migrations/` - Diretório contendo scripts de migração SQL
  - `20250523_recreate_database.sql` - Script para criar todas as tabelas e funções
  - `20250523_seed_data.sql` - Script para inserir dados de exemplo
- `generate-types.sh` - Script para gerar tipos TypeScript a partir do esquema

## Como Configurar o Banco de Dados

### 1. Criar um Projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Crie uma nova organização (se necessário)
3. Crie um novo projeto
4. Anote a URL e a chave anônima do projeto

### 2. Aplicar as Migrações

1. No painel do Supabase, vá para a seção "SQL Editor"
2. Crie uma nova consulta
3. Cole o conteúdo do arquivo `migrations/20250523_recreate_database.sql`
4. Execute a consulta
5. Crie outra consulta com o conteúdo de `migrations/20250523_seed_data.sql` (opcional)
6. Execute a consulta

### 3. Configurar o Cliente

1. Abra o arquivo `src/integrations/supabase/client.ts`
2. Atualize as variáveis `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` com os valores do seu projeto

### 4. Gerar Tipos TypeScript

1. Certifique-se de ter a CLI do Supabase instalada:
   ```bash
   npm install -g supabase
   ```
2. Autentique-se na CLI do Supabase:
   ```bash
   supabase login
   ```
3. Execute o script de geração de tipos:
   ```bash
   cd supabase
   chmod +x generate-types.sh
   ./generate-types.sh
   ```

## Estrutura do Banco de Dados

O banco de dados consiste em 17 tabelas organizadas em categorias:

### Tabelas Principais
- `profiles` - Perfis de usuários
- `user_roles` - Papéis de usuários
- `courses` - Cursos
- `classes` - Turmas
- `manual_enrollments` - Matrículas

### Tabelas Financeiras
- `financial_categories` - Categorias financeiras
- `payables` - Contas a pagar
- `receivables` - Contas a receber
- `transactions` - Transações
- `discount_coupons` - Cupons de desconto

### Tabelas de Conteúdo
- `blog_posts` - Posts do blog
- `photography_questions` - Perguntas de fotografia
- `photography_answers` - Respostas de fotografia
- `quiz_scores` - Pontuações de quiz

### Tabelas de Configuração
- `ai_settings` - Configurações de IA
- `newsletter_subscribers` - Assinantes da newsletter
- `role_permissions` - Permissões de papéis

## Segurança

O banco de dados utiliza Row Level Security (RLS) para controlar o acesso aos dados:

- Cada tabela tem políticas específicas de segurança
- O acesso é controlado com base nos papéis dos usuários
- Autenticação é gerenciada pelo Supabase Auth

## Funções e Triggers

O banco de dados inclui várias funções e triggers:

### Funções
- `get_user_profile` - Obtém o perfil de um usuário
- `update_user_profile` - Atualiza o perfil de um usuário
- `get_user_roles` - Obtém os papéis de um usuário
- `has_role` - Verifica se um usuário tem um papel específico
- `is_coupon_valid` - Verifica se um cupom é válido
- `get_ai_settings` - Obtém as configurações de IA
- `update_ai_settings` - Atualiza as configurações de IA
- `get_financial_stats` - Obtém estatísticas financeiras

### Triggers
- `after_enrollment_insert` - Atualiza vagas disponíveis após uma matrícula
- `on_auth_user_created` - Cria perfil e papel para novos usuários

## Uso no Código

Para interagir com o banco de dados no código, utilize:

1. **SupabaseService** (`src/services/supabase.service.ts`) - Classe de serviço com métodos para todas as operações
2. **Hooks React** (`src/hooks/useSupabaseData.ts`) - Hooks para usar o Supabase em componentes React
3. **Contexto de Autenticação** (`src/contexts/SupabaseContext.tsx`) - Contexto para gerenciar autenticação e perfil

## Documentação Completa

Para uma documentação mais detalhada sobre o banco de dados e como utilizá-lo, consulte o arquivo `docs/banco-de-dados.md` na raiz do projeto.

## Solução de Problemas

### Erro ao executar migrações
- Verifique se você tem permissões de administrador no projeto Supabase
- Execute as migrações em ordem (primeiro `recreate_database.sql`, depois `seed_data.sql`)
- Verifique se não há conflitos com tabelas existentes

### Erro ao gerar tipos TypeScript
- Certifique-se de ter a CLI do Supabase instalada e autenticada
- Verifique se o ID do projeto no arquivo `config.toml` está correto
- Verifique se você tem permissões para acessar o projeto

### Erros de autenticação
- Verifique se as variáveis `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` estão corretas
- Certifique-se de que o serviço de autenticação está ativado no projeto Supabase

## Manutenção

Para manter o banco de dados:

1. **Backup regular** - Faça backups regulares do banco de dados
2. **Atualize os tipos** - Execute `generate-types.sh` após alterações no esquema
3. **Monitore o desempenho** - Verifique regularmente o desempenho das consultas
4. **Atualize as políticas de segurança** - Revise e atualize as políticas de segurança conforme necessário
