#!/bin/bash

# Script para gerar tipos TypeScript a partir do esquema do Supabase
# Certifique-se de ter a CLI do Supabase instalada e autenticada

# Obtenha o ID do projeto do arquivo config.toml
PROJECT_ID=$(grep -oP 'project_id = "\K[^"]+' ./config.toml)

if [ -z "$PROJECT_ID" ]; then
  echo "Erro: Não foi possível encontrar o ID do projeto no arquivo config.toml"
  exit 1
fi

echo "Gerando tipos TypeScript para o projeto: $PROJECT_ID"

# Gere os tipos TypeScript
npx supabase gen types typescript --project-id "$PROJECT_ID" > ../src/integrations/supabase/types.ts

echo "Tipos TypeScript gerados com sucesso em src/integrations/supabase/types.ts"
