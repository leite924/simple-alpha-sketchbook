
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ModelSelectorProps {
  provider: string | null;
  model: string | null;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

const ModelSelector = ({ provider, model, onModelChange, disabled = false }: ModelSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Modelo</Label>
      <Select 
        value={model || ''}
        onValueChange={onModelChange}
        disabled={disabled || !provider}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um modelo" />
        </SelectTrigger>
        <SelectContent>
          {provider === 'openai' ? (
            <>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
            </>
          ) : provider === 'perplexity' ? (
            <>
              <SelectItem value="llama-3.1-sonar-small-128k-online">Llama 3.1 Sonar Small</SelectItem>
              <SelectItem value="llama-3.1-sonar-large-128k-online">Llama 3.1 Sonar Large</SelectItem>
            </>
          ) : null}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;
