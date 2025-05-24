
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AIConfig } from "./types";

// Get AI configuration from database
export const getAIConfig = async (): Promise<AIConfig | null> => {
  try {
    console.log('Iniciando busca de configuração de IA');
    
    const { data, error } = await supabase.rpc('get_ai_settings');
      
    if (error) {
      console.error('Error fetching AI configuration:', error);
      return null;
    }
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('No AI configuration found');
      return null;
    }
    
    // Convert the returned data to our AIConfig format
    const record = data[0];
    
    console.log('Configuração de IA carregada com sucesso:', {
      provider: record.provider,
      model: record.model,
      apiKeyPresent: !!record.api_key
    });
    
    return {
      provider: record.provider as 'openai' | 'perplexity' | null,
      model: record.model,
      apiKey: record.api_key || '',
      lastUpdated: record.last_updated || undefined,
      updatedBy: record.updated_by || undefined
    };
  } catch (error) {
    console.error('Exception when fetching AI configuration:', error);
    return null;
  }
};

// Update AI configuration with improved error handling
export const updateAIConfig = async (config: AIConfig): Promise<boolean> => {
  try {
    console.log('Iniciando atualização da configuração de IA:', {
      provider: config.provider,
      model: config.model,
      apiKeyLength: config.apiKey ? config.apiKey.length : 0
    });
    
    if (!config.provider || !config.model || !config.apiKey) {
      console.error('Dados inválidos ao atualizar configuração de IA');
      toast.error('Dados inválidos. Preencha todos os campos.');
      return false;
    }
    
    // Use the database function for updating AI settings
    const { error } = await supabase.rpc('update_ai_settings', {
      p_provider: config.provider,
      p_model: config.model,
      p_api_key: config.apiKey
    });
      
    if (error) {
      console.error('Error updating AI configuration:', error);
      toast.error(`Falha ao atualizar configurações de IA: ${error.message}`);
      return false;
    }
    
    console.log('Configuração de IA atualizada com sucesso');
    toast.success('Configurações de IA atualizadas com sucesso');
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Exception when updating AI configuration:', error);
    toast.error(`Erro ao atualizar configurações de IA: ${errorMessage}`);
    return false;
  }
};
