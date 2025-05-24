
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAISettings } from "@/hooks/useAISettings";
import { ProviderSelector, ModelSelector, ApiKeyInput, DialogError, DialogActions } from './dialog';
import { AIConfig } from '../types';

const AISettings: React.FC = () => {
  const {
    aiConfig,
    isLoading,
    error,
    saveError,
    refetch,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleSaveConfig,
    isUpdating,
    attemptCount
  } = useAISettings();

  const handleConfigSave = (config: AIConfig) => {
    handleSaveConfig(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Inteligência Artificial</CardTitle>
        <CardDescription>
          Configure o provedor de IA, modelo e chave de API para geração de conteúdo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Carregando configurações...</p>
        ) : error ? (
          <DialogError error={`Erro ao carregar configurações: ${error.message}`} />
        ) : (
          <>
            <ProviderSelector
              provider={aiConfig?.provider || null}
              onProviderChange={(provider) => {
                if (aiConfig) {
                  handleConfigSave({ ...aiConfig, provider });
                }
              }}
            />
            <ModelSelector
              provider={aiConfig?.provider || null}
              model={aiConfig?.model || null}
              onModelChange={(model) => {
                if (aiConfig) {
                  handleConfigSave({ ...aiConfig, model });
                }
              }}
            />
            <ApiKeyInput
              provider={aiConfig?.provider || null}
              apiKey={aiConfig?.apiKey || null}
              onApiKeyChange={(apiKey) => {
                if (aiConfig) {
                  handleConfigSave({ ...aiConfig, apiKey });
                }
              }}
            />
            {saveError && <DialogError error={`Erro ao salvar: ${saveError}`} />}
            <DialogActions
              onCancel={() => setIsEditDialogOpen(false)}
              onSave={() => refetch()}
              isUpdating={isUpdating}
              isFormValid={true}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AISettings;
