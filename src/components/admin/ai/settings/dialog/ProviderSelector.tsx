
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProviderSelectorProps {
  provider: string | null;
  onProviderChange: (provider: 'openai' | 'perplexity') => void;
  disabled?: boolean;
}

const ProviderSelector = ({ provider, onProviderChange, disabled = false }: ProviderSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Provedor de IA</Label>
      <RadioGroup 
        value={provider || ''}
        onValueChange={(value) => onProviderChange(value as 'openai' | 'perplexity')}
        className="flex flex-col space-y-1"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="openai" id="openai" />
          <Label htmlFor="openai">OpenAI</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="perplexity" id="perplexity" />
          <Label htmlFor="perplexity">Perplexity AI</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ProviderSelector;
