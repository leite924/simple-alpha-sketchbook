
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIResponse } from "@/components/admin/ai/types";

interface ContentDisplayProps {
  generatedContent: AIResponse | null;
  onCopyToClipboard: () => void;
}

const ContentDisplay = ({ generatedContent, onCopyToClipboard }: ContentDisplayProps) => {
  if (!generatedContent) {
    return (
      <p>Nenhum conteúdo gerado ainda. Configure o prompt e clique em "Gerar Conteúdo".</p>
    );
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <Textarea readOnly value={generatedContent.content} className="min-h-[300px]" />
      </ScrollArea>
      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onCopyToClipboard}>
          Copiar para a Área de Transferência
        </Button>
      </div>
    </div>
  );
};

export default ContentDisplay;
