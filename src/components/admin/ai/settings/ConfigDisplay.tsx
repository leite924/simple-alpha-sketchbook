
import { Label } from "@/components/ui/label";
import { AIConfig } from "@/components/admin/ai/types";

interface ConfigDisplayProps {
  aiConfig: AIConfig | null;
}

const ConfigDisplay = ({ aiConfig }: ConfigDisplayProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Provedor</Label>
          <div className="mt-1 font-medium">
            {aiConfig?.provider === 'openai' ? 'OpenAI' : 
             aiConfig?.provider === 'perplexity' ? 'Perplexity AI' : 
             'Não configurado'}
          </div>
        </div>
        
        <div>
          <Label>Modelo</Label>
          <div className="mt-1 font-medium">
            {aiConfig?.model || 'Não configurado'}
          </div>
        </div>
        
        <div>
          <Label>Chave API</Label>
          <div className="mt-1 font-medium">
            {aiConfig?.apiKey ? '••••••••••••••••' : 'Não configurada'}
          </div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {aiConfig?.lastUpdated && `Última atualização: ${new Date(aiConfig.lastUpdated).toLocaleString('pt-BR')}`}
      </div>
    </div>
  );
};

export default ConfigDisplay;
