
import { useState, useEffect } from 'react';
import { AIConfig, AIModel } from '@/components/admin/ai/types';
import { toast } from 'sonner';

export const useConfigForm = (aiConfig: AIConfig | null, isUpdating: boolean) => {
  const [editConfig, setEditConfig] = useState<AIConfig>({
    provider: null,
    model: null,
    apiKey: null
  });
  
  const [validationError, setValidationError] = useState<string | null>(null);
  
  useEffect(() => {
    if (aiConfig) {
      console.log("Configurações atuais carregadas no diálogo:", {
        provider: aiConfig.provider,
        model: aiConfig.model,
        apiKeyPresent: !!aiConfig.apiKey
      });
      
      setEditConfig({
        provider: aiConfig.provider,
        model: aiConfig.model,
        apiKey: aiConfig.apiKey,
      });
      setValidationError(null);
    } else {
      setEditConfig({
        provider: null,
        model: null,
        apiKey: null
      });
      setValidationError(null);
    }
  }, [aiConfig]);
  
  const handleProviderChange = (provider: 'openai' | 'perplexity') => {
    // Reset model when changing provider since they have different models
    setEditConfig({
      ...editConfig,
      provider,
      model: null
    });
    setValidationError(null);
  };
  
  const handleModelChange = (model: AIModel) => {
    setEditConfig({
      ...editConfig,
      model
    });
    setValidationError(null);
  };
  
  const handleApiKeyChange = (apiKey: string) => {
    setEditConfig({
      ...editConfig,
      apiKey
    });
    setValidationError(null);
  };
  
  const validateConfig = (): boolean => {
    if (!editConfig.provider) {
      setValidationError("Selecione um provedor de IA");
      return false;
    }
    
    if (!editConfig.model) {
      setValidationError("Selecione um modelo de IA");
      return false;
    }
    
    if (!editConfig.apiKey || editConfig.apiKey.trim().length < 10) {
      setValidationError("Insira uma chave API válida");
      return false;
    }
    
    setValidationError(null);
    return true;
  };

  const isFormValid = !!editConfig.provider && 
                      !!editConfig.model && 
                      !!editConfig.apiKey && 
                      editConfig.apiKey.trim().length >= 10;
  
  return {
    editConfig,
    validationError,
    isFormValid,
    handleProviderChange,
    handleModelChange,
    handleApiKeyChange,
    validateConfig,
    setValidationError
  };
};
