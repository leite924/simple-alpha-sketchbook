# Configuração do Banco de Dados Supabase

Este diretório contém os scripts de migração para configurar o banco de dados Supabase do projeto.

## Estrutura do Banco de Dados

O banco de dados consiste nas seguintes tabelas:

1. `ai_settings` - Configurações de IA
2. `blog_posts` - Posts do blog
3. `classes` - Turmas/aulas
4. `courses` - Cursos
5. `discount_coupons` - Cupons de desconto
6. `financial_categories` - Categorias financeiras
7. `manual_enrollments` - Matrículas manuais
8. `newsletter_subscribers` - Assinantes da newsletter
9. `payables` - Contas a pagar
10. `photography_answers` - Respostas de fotografia
11. `photography_questions` - Perguntas de fotografia
12. `profiles` - Perfis de usuários
13. `quiz_scores` - Pontuações de quiz
14. `receivables` - Contas a receber
15. `role_permissions` - Permissões de papéis
16. `transactions` - Transações
17. `user_roles` - Papéis de usuários

## Como Aplicar as Migrações

Para aplicar as migrações ao seu projeto Supabase, siga estas etapas:

1. Acesse o painel de controle do Supabase (https://app.supabase.com)
2. Selecione seu projeto
3. Vá para a seção "SQL Editor"
4. Crie uma nova consulta
5. Copie e cole o conteúdo do arquivo `migrations/20250523_recreate_database.sql`
6. Execute a consulta

Alternativamente, você pode usar a CLI do Supabase para aplicar as migrações:

```bash
supabase db push
```

## Políticas de Segurança (RLS)

O script de migração inclui políticas de segurança em nível de linha (RLS) para todas as tabelas. Essas políticas controlam quem pode ver, criar, atualizar e excluir registros em cada tabela.

## Funções do Banco de Dados

O script inclui várias funções úteis:

- `get_user_profile` - Obtém o perfil de um usuário
- `update_user_profile` - Atualiza o perfil de um usuário
- `get_user_roles` - Obtém os papéis de um usuário
- `has_role` - Verifica se um usuário tem um papel específico
- `is_coupon_valid` - Verifica se um cupom é válido
- `get_ai_settings` - Obtém as configurações de IA
- `update_ai_settings` - Atualiza as configurações de IA
- `get_financial_stats` - Obtém estatísticas financeiras

## Triggers

O script inclui dois triggers:

1. `after_enrollment_insert` - Atualiza o número de vagas disponíveis em uma turma quando uma nova matrícula é criada
2. `on_auth_user_created` - Cria um perfil e atribui o papel 'user' quando um novo usuário é criado

## Configuração do Cliente

O cliente Supabase está configurado no arquivo `src/integrations/supabase/client.ts`. Certifique-se de que as variáveis `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` estejam corretas.
