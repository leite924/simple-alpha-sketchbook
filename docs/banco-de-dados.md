# Documentação do Banco de Dados

## Visão Geral

O sistema utiliza o Supabase como plataforma de banco de dados. O Supabase é uma alternativa de código aberto ao Firebase, oferecendo um banco de dados PostgreSQL com APIs RESTful e em tempo real.

## Estrutura do Banco de Dados

O banco de dados consiste nas seguintes tabelas:

### Tabelas Principais

1. **profiles** - Perfis de usuários
   - Armazena informações detalhadas dos usuários
   - Vinculado à tabela de autenticação do Supabase

2. **user_roles** - Papéis de usuários
   - Define os papéis dos usuários no sistema (admin, super_admin, instructor, student, user)
   - Permite controle de acesso granular

3. **courses** - Cursos
   - Catálogo de cursos oferecidos
   - Informações básicas como nome, descrição e preço

4. **classes** - Turmas
   - Instâncias específicas de cursos com horários e vagas
   - Vinculado a um curso específico

5. **manual_enrollments** - Matrículas
   - Registro de matrículas de estudantes em turmas
   - Inclui informações de pagamento e descontos

### Tabelas Financeiras

6. **financial_categories** - Categorias financeiras
   - Categorias para classificar transações financeiras
   - Tipos: receita (income) ou despesa (expense)

7. **payables** - Contas a pagar
   - Registro de despesas a serem pagas
   - Vinculado a categorias financeiras

8. **receivables** - Contas a receber
   - Registro de receitas a serem recebidas
   - Vinculado a categorias financeiras

9. **transactions** - Transações
   - Registro de todas as transações financeiras
   - Pode ser vinculado a outras entidades (referência)

10. **discount_coupons** - Cupons de desconto
    - Cupons para aplicar descontos em matrículas
    - Pode ser específico para um curso ou geral

### Tabelas de Conteúdo

11. **blog_posts** - Posts do blog
    - Conteúdo para o blog do site
    - Inclui categorias e tags

12. **photography_questions** - Perguntas de fotografia
    - Banco de perguntas para o quiz de fotografia
    - Categorizado por dificuldade e tema

13. **photography_answers** - Respostas de fotografia
    - Alternativas para as perguntas do quiz
    - Indica qual alternativa é a correta

14. **quiz_scores** - Pontuações de quiz
    - Registra as pontuações dos usuários no quiz
    - Histórico de tentativas

### Tabelas de Configuração

15. **ai_settings** - Configurações de IA
    - Configurações para integração com IA
    - Armazena chaves de API e preferências

16. **newsletter_subscribers** - Assinantes da newsletter
    - Lista de e-mails para envio de newsletter
    - Controle de status (ativo/inativo)

17. **role_permissions** - Permissões de papéis
    - Define permissões específicas para cada papel
    - Controle granular por módulo do sistema

## Relações entre Tabelas

- **classes** → **courses**: Uma turma pertence a um curso
- **manual_enrollments** → **classes**: Uma matrícula é feita em uma turma
- **manual_enrollments** → **discount_coupons**: Uma matrícula pode usar um cupom
- **payables** → **financial_categories**: Uma conta a pagar pertence a uma categoria
- **receivables** → **financial_categories**: Uma conta a receber pertence a uma categoria
- **photography_answers** → **photography_questions**: Respostas pertencem a uma pergunta
- **discount_coupons** → **courses**: Um cupom pode ser específico para um curso

## Funções do Banco de Dados

O banco de dados inclui várias funções úteis:

1. **get_user_profile** - Obtém o perfil de um usuário
2. **update_user_profile** - Atualiza o perfil de um usuário
3. **get_user_roles** - Obtém os papéis de um usuário
4. **has_role** - Verifica se um usuário tem um papel específico
5. **is_coupon_valid** - Verifica se um cupom é válido
6. **get_ai_settings** - Obtém as configurações de IA
7. **update_ai_settings** - Atualiza as configurações de IA
8. **get_financial_stats** - Obtém estatísticas financeiras

## Políticas de Segurança (RLS)

O banco de dados utiliza Row Level Security (RLS) para controlar o acesso aos dados:

- Usuários só podem ver e editar seus próprios dados
- Administradores podem gerenciar todos os dados
- Estudantes podem ver apenas suas próprias matrículas
- Instrutores podem ver e gerenciar apenas suas próprias turmas
- Todos podem ver cursos e turmas ativos

## Como Usar no Código

### Configuração da Conexão

A conexão com o Supabase é configurada no arquivo `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cpcqzjhwjnnkaffixbpi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sua-chave-aqui";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage
    }
  }
);
```

### Serviço Supabase

O arquivo `src/services/supabase.service.ts` fornece uma interface para interagir com o banco de dados:

```typescript
// Exemplo de uso
import SupabaseService from '@/services/supabase.service';

// Buscar cursos
const { data: courses, error } = await SupabaseService.getCourses();

// Criar um novo curso
const newCourse = {
  name: 'Novo Curso',
  slug: 'novo-curso',
  description: 'Descrição do novo curso',
  price: 499.90,
  is_active: true
};
const { data, error } = await SupabaseService.createCourse(newCourse);
```

### Hooks React

Os hooks em `src/hooks/useSupabaseData.ts` facilitam o uso do Supabase em componentes React:

```typescript
// Exemplo de uso
import { useCourses, useCourseBySlug } from '@/hooks/useSupabaseData';

function CoursesList() {
  const { data: courses, loading, error } = useCourses();
  
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;
  
  return (
    <ul>
      {courses?.map(course => (
        <li key={course.id}>{course.name}</li>
      ))}
    </ul>
  );
}
```

### Contexto de Autenticação

O contexto em `src/contexts/SupabaseContext.tsx` gerencia a autenticação e o perfil do usuário:

```typescript
// Exemplo de uso
import { useSupabase } from '@/contexts/SupabaseContext';

function ProfilePage() {
  const { user, userProfile, updateProfile } = useSupabase();
  
  if (!user) return <p>Faça login para ver seu perfil</p>;
  if (!userProfile) return <p>Carregando perfil...</p>;
  
  return (
    <div>
      <h1>Perfil de {userProfile.first_name}</h1>
      {/* Formulário de perfil */}
    </div>
  );
}
```

## Migrações e Seed Data

Os scripts de migração estão disponíveis em `supabase/migrations/`:

- `20250523_recreate_database.sql` - Cria todas as tabelas e funções
- `20250523_seed_data.sql` - Insere dados de exemplo

Para aplicar as migrações:

1. Acesse o painel de controle do Supabase
2. Vá para a seção "SQL Editor"
3. Execute os scripts na ordem correta

## Geração de Tipos TypeScript

Para gerar tipos TypeScript a partir do esquema do banco de dados:

```bash
cd supabase
./generate-types.sh
```

Isso atualizará o arquivo `src/integrations/supabase/types.ts` com os tipos mais recentes do banco de dados.

## Boas Práticas

1. **Sempre use o serviço Supabase** - Evite fazer chamadas diretas ao cliente Supabase
2. **Use os hooks React** - Eles gerenciam o estado de carregamento e erros
3. **Verifique papéis de usuário** - Use `hasRole` para controle de acesso
4. **Mantenha os tipos atualizados** - Execute `generate-types.sh` após alterações no esquema
5. **Use transações** - Para operações que afetam múltiplas tabelas
6. **Valide dados** - Sempre valide dados antes de enviar ao banco de dados
7. **Trate erros** - Sempre verifique e trate erros retornados pelo Supabase
