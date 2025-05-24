
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiKeyInputProps {
  provider: string | null;
  apiKey: string | null;
  onApiKeyChange: (apiKey: string) => void;
  disabled?: boolean;
}

const ApiKeyInput = ({ provider, apiKey, onApiKeyChange, disabled = false }: ApiKeyInputProps) => {
  return (
    <div className="space-y-2">
      <Label>Chave API</Label>
      <Input
        value={apiKey || ''}
        onChange={(e) => onApiKeyChange(e.target.value)}
        placeholder="Insira sua chave API"
        type="password"
        className="font-mono"
        disabled={disabled}
      />
      <p className="text-xs text-muted-foreground">
        {provider === 'openai' ? 
          'Obtenha sua chave API em https://platform.openai.com/api-keys' : 
         provider === 'perplexity' ? 
          'Obtenha sua chave API em https://www.perplexity.ai/settings/api' : 
          'Selecione um provedor para obter instruções'}
      </p>
    </div>
  );
};

export default ApiKeyInput;
