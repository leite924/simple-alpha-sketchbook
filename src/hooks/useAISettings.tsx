
import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AIConfig } from "@/components/admin/ai/types";
import { getAIConfig, updateAIConfig } from "@/components/admin/ai/configService";
import { toast } from "sonner";

// Hook for fetching AI configuration
export const useFetchAIConfig = () => {
  console.log("useFetchAIConfig initialized");
  
  return useQuery({
    queryKey: ['aiConfig'],
    queryFn: async () => {
      console.log("Buscando configurações de IA...");
      try {
        const config = await getAIConfig();
        console.log("Configurações de IA carregadas:", config ? "Sucesso" : "Não encontradas");
        return config;
      } catch (err) {
        console.error("Erro ao carregar configurações de IA:", err);
        toast.error("Erro ao carregar configurações de IA");
        throw err;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5 // 5 minutos
  });
};

// Hook for updating AI configuration
export const useUpdateAIConfig = (
  setIsEditDialogOpen: (value: boolean) => void,
  setSaveError: (error: string | null) => void,
  setAttemptCount: (callback: (prev: number) => number) => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (config: AIConfig) => {
      console.log("Iniciando mutação para salvar config:", config);
      setSaveError(null);
      setAttemptCount(prev => prev + 1);
      
      // Add artificial delay to ensure UI feedback is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await updateAIConfig(config);
      if (!result) {
        throw new Error("Falha ao atualizar configurações");
      }
      return result;
    },
    onMutate: () => {
      console.log("Mutação iniciada");
      setSaveError(null);
    },
    onSuccess: () => {
      console.log("Mutação bem-sucedida");
      queryClient.invalidateQueries({ queryKey: ['aiConfig'] });
      
      // Primeiro invalidar a query, depois fechar o diálogo com pequeno delay
      setTimeout(() => {
        setIsEditDialogOpen(false);
        toast.success("Configurações de IA atualizadas com sucesso");
        setSaveError(null);
      }, 500);
    },
    onError: (error: any) => {
      console.error("Erro na atualização:", error);
      const errorMessage = error?.message || 'Erro desconhecido';
      setSaveError(errorMessage);
      toast.error(`Erro ao atualizar configurações: ${errorMessage}`);
    }
  });
};

// Main hook that combines all the pieces
export const useAISettings = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  console.log("useAISettings hook inicializado");
  
  // Reset error state when component mounts or is refreshed
  useEffect(() => {
    setSaveError(null);
  }, []);
  
  // Use the extracted hooks
  const { 
    data: aiConfig,
    isLoading,
    error,
    refetch
  } = useFetchAIConfig();
  
  // Create update mutation with necessary dependencies
  const updateConfigMutation = useUpdateAIConfig(
    setIsEditDialogOpen,
    setSaveError,
    setAttemptCount
  );
  
  console.log("Estado atual do hook useAISettings:", { 
    temConfiguracao: !!aiConfig, 
    isLoading, 
    temErro: !!error,
    temErroSalvamento: !!saveError
  });
  
  // Handle save config logic
  const handleSaveConfig = useCallback((config: AIConfig) => {
    console.log("Salvando configuração:", {
      provider: config.provider,
      model: config.model,
      apiKeyLength: config.apiKey ? config.apiKey.length : 0
    });
    
    // Validar dados antes de enviar para a mutation
    if (!config.provider || !config.model || !config.apiKey) {
      toast.error("Preencha todos os campos obrigatórios");
      setSaveError("Dados incompletos");
      return;
    }
    
    updateConfigMutation.mutate(config);
  }, [updateConfigMutation]);
  
  // Wrap in useCallback to prevent recreation on each render
  const setIsEditDialogOpenHandler = useCallback((value: boolean) => {
    if (!value) {
      // Resetar erro quando o diálogo for fechado
      setSaveError(null);
    }
    setIsEditDialogOpen(value);
  }, []);
  
  return {
    aiConfig,
    isLoading,
    error,
    saveError,
    refetch,
    isEditDialogOpen,
    setIsEditDialogOpen: setIsEditDialogOpenHandler,
    handleSaveConfig,
    isUpdating: updateConfigMutation.isPending,
    attemptCount
  };
};
