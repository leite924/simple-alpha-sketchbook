
import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AIConfig } from "@/components/admin/ai/types";

import { useConfigForm } from "./hooks/useConfigForm";
import { ProviderSelector, ModelSelector, ApiKeyInput, DialogError, DialogActions } from "./dialog";

interface ConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  aiConfig: AIConfig | null;
  onSave: (config: AIConfig) => void;
  isUpdating: boolean;
  saveError?: string | null;
}

const ConfigDialog = ({ 
  isOpen, 
  onOpenChange, 
  aiConfig, 
  onSave, 
  isUpdating, 
  saveError 
}: ConfigDialogProps) => {
  
  const {
    editConfig,
    validationError,
    isFormValid,
    handleProviderChange,
    handleModelChange,
    handleApiKeyChange,
    validateConfig,
    setValidationError
  } = useConfigForm(aiConfig, isUpdating);
  
  // Prevent closing dialog when updating
  useEffect(() => {
    if (isUpdating) {
      console.log("Em atualização, bloqueando fechamento do modal");
    }
  }, [isUpdating]);
  
  const handleSubmit = () => {
    console.log("Enviando configuração para salvar:", {
      provider: editConfig.provider,
      model: editConfig.model,
      apiKeyLength: editConfig.apiKey ? editConfig.apiKey.length : 0
    });
    
    if (!validateConfig()) {
      toast.error("Dados inválidos. Verifique todos os campos.");
      return;
    }
    
    try {
      onSave(editConfig);
    } catch (error) {
      console.error("Erro ao enviar configuração:", error);
      toast.error("Falha ao processar o pedido de salvamento");
      setValidationError("Erro ao processar o pedido de salvamento");
    }
  };

  // Prevent closing dialog when updating
  const safeOnOpenChange = (open: boolean) => {
    if (!open && isUpdating) {
      console.log("Prevenindo fechamento do diálogo durante atualização");
      toast.info("Aguarde a conclusão do salvamento...");
      return;
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={safeOnOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurações de IA</DialogTitle>
          <DialogDescription>
            Configure o serviço de IA para geração de conteúdo. Apenas super administradores podem alterar estas configurações.
          </DialogDescription>
        </DialogHeader>
        
        <DialogError error={saveError || validationError} />
        
        <div className="space-y-6 py-4">
          <ProviderSelector 
            provider={editConfig.provider} 
            onProviderChange={handleProviderChange}
            disabled={isUpdating}
          />
          
          <ModelSelector 
            provider={editConfig.provider}
            model={editConfig.model}
            onModelChange={handleModelChange}
            disabled={isUpdating}
          />
          
          <ApiKeyInput 
            provider={editConfig.provider}
            apiKey={editConfig.apiKey}
            onApiKeyChange={handleApiKeyChange}
            disabled={isUpdating}
          />
        </div>
        
        <DialogFooter>
          <DialogActions
            onCancel={() => safeOnOpenChange(false)}
            onSave={handleSubmit}
            isUpdating={isUpdating}
            isFormValid={isFormValid}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigDialog;
