
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentPrompt } from "@/components/admin/ai/types";

interface PromptFormProps {
  prompt: ContentPrompt;
  setPrompt: (prompt: ContentPrompt) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const PromptForm = ({ prompt, setPrompt, onGenerate, isGenerating }: PromptFormProps) => {
  const [contentType, setContentType] = useState<'blog' | 'course' | 'seo' | 'dashboard'>(prompt.type);

  const handleContentTypeChange = (value: string) => {
    setContentType(value as 'blog' | 'course' | 'seo' | 'dashboard');
    setPrompt({ ...prompt, type: value as 'blog' | 'course' | 'seo' | 'dashboard' });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contentType">Tipo de Conteúdo</Label>
          <Select onValueChange={handleContentTypeChange} value={contentType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">Blog Post</SelectItem>
              <SelectItem value="course">Descrição de Curso</SelectItem>
              <SelectItem value="seo">SEO Meta Description</SelectItem>
              <SelectItem value="dashboard">Dashboard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="topic">Tópico</Label>
          <Input
            id="topic"
            placeholder="Insira o tópico"
            value={prompt.topic || ''}
            onChange={(e) => setPrompt({ ...prompt, topic: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="keywords">Palavras-chave</Label>
          <Input
            id="keywords"
            placeholder="Palavras-chave separadas por vírgula"
            value={prompt.keywords?.join(', ') || ''}
            onChange={(e) =>
              setPrompt({ ...prompt, keywords: e.target.value.split(',').map((k) => k.trim()) })
            }
          />
        </div>
        <div>
          <Label htmlFor="targetAudience">Público-alvo</Label>
          <Input
            id="targetAudience"
            placeholder="Defina o público-alvo"
            value={prompt.targetAudience || ''}
            onChange={(e) => setPrompt({ ...prompt, targetAudience: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tone">Tom de Voz</Label>
          <Select 
            onValueChange={(value) => setPrompt({ ...prompt, tone: value as 'formal' | 'casual' | 'technical' | 'friendly' })}
            value={prompt.tone || 'casual'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="technical">Técnico</SelectItem>
              <SelectItem value="friendly">Amigável</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="length">Comprimento</Label>
          <Select 
            onValueChange={(value) => setPrompt({ ...prompt, length: value as 'short' | 'medium' | 'long' })}
            value={prompt.length || 'medium'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o comprimento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Curto</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="long">Longo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="additionalInstructions">Instruções Adicionais</Label>
        <Textarea
          id="additionalInstructions"
          placeholder="Instruções adicionais para a IA"
          value={prompt.additionalInstructions || ''}
          onChange={(e) => setPrompt({ ...prompt, additionalInstructions: e.target.value })}
        />
      </div>
      <Button onClick={onGenerate} disabled={isGenerating}>
        {isGenerating ? 'Gerando...' : 'Gerar Conteúdo'}
      </Button>
    </div>
  );
};

export default PromptForm;
