
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentPrompt, AIResponse } from "@/components/admin/ai/types";
import { generateContent } from "@/components/admin/ai/contentService";
import { useQuery } from "@tanstack/react-query";
import { getAIConfig } from "@/components/admin/ai/configService";
import PromptForm from "./content-generator/PromptForm";
import ContentDisplay from "./content-generator/ContentDisplay";
import AIConfigWarning from "./content-generator/AIConfigWarning";

interface AIContentGeneratorProps {
  onSelectContent?: (content: string) => void;
}

const AIContentGenerator = ({ onSelectContent }: AIContentGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIResponse | null>(null);
  const [prompt, setPrompt] = useState<ContentPrompt>({
    type: 'blog',
    topic: '',
    keywords: [],
    targetAudience: '',
    tone: 'casual',
    length: 'medium'
  });

  // Fetch AI configuration to check if it's configured
  const { data: aiConfig } = useQuery({
    queryKey: ['aiConfig'],
    queryFn: getAIConfig
  });

  const aiConfigured = !!aiConfig?.apiKey;

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await generateContent(prompt);
      setGeneratedContent(response);
      if (response?.content && onSelectContent) {
        onSelectContent(response.content);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (generatedContent?.content) {
      await navigator.clipboard.writeText(generatedContent.content);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerador de Conteúdo com IA</CardTitle>
        <CardDescription>
          Crie conteúdo otimizado para diversas finalidades com o poder da inteligência artificial.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AIConfigWarning isConfigured={aiConfigured} />
        
        {aiConfigured && (
          <Tabs defaultValue="prompt" className="space-y-4">
            <TabsList>
              <TabsTrigger value="prompt">Configurações do Prompt</TabsTrigger>
              <TabsTrigger value="content">Conteúdo Gerado</TabsTrigger>
            </TabsList>
            <TabsContent value="prompt" className="space-y-4">
              <PromptForm 
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerateContent}
                isGenerating={isGenerating}
              />
            </TabsContent>
            <TabsContent value="content">
              <ContentDisplay 
                generatedContent={generatedContent}
                onCopyToClipboard={handleCopyToClipboard}
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Dica: Utilize palavras-chave relevantes e um tom de voz adequado para obter melhores resultados.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AIContentGenerator;
