
import { useState, useEffect, useCallback, memo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentPrompt, AIResponse } from "@/components/admin/ai/types";
import { generateContent } from "@/components/admin/ai/contentService";
import { useQuery } from "@tanstack/react-query";
import { getAIConfig } from "@/components/admin/ai/configService";
import PromptForm from "./PromptForm";
import ContentDisplay from "./ContentDisplay";
import AIConfigWarning from "./AIConfigWarning";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AIContentGeneratorProps {
  onSelectContent?: (content: string) => void;
}

const AIContentGenerator = memo(({ onSelectContent }: AIContentGeneratorProps) => {
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

  // Enhanced fetch AI configuration with proper error handling
  const { 
    data: aiConfig, 
    isLoading, 
    isError,
    error 
  } = useQuery({
    queryKey: ['aiConfig'],
    queryFn: getAIConfig
  });
  
  // Add debugging logs to track the AI config
  useEffect(() => {
    console.log("AIContentGenerator - Configuração de IA:", aiConfig);
  }, [aiConfig]);

  // Safe check for configuration - prevent infinite loops
  const aiConfigured = aiConfig?.apiKey ? true : false;

  const handleGenerateContent = useCallback(async () => {
    setIsGenerating(true);
    try {
      const response = await generateContent(prompt);
      setGeneratedContent(response);
      if (response?.content && onSelectContent) {
        onSelectContent(response.content);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, onSelectContent]);

  const handleCopyToClipboard = useCallback(async () => {
    if (generatedContent?.content) {
      await navigator.clipboard.writeText(generatedContent.content);
    }
  }, [generatedContent]);

  console.log("AIContentGenerator rendering:", {
    isLoading,
    isError,
    aiConfigured
  });

  // Show loading state
  if (isLoading) {
    return (
      <Card data-testid="ai-content-generator-loading">
        <CardContent className="pt-6">
          <p className="text-center py-8">Carregando configurações de IA...</p>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Card data-testid="ai-content-generator-error">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar configuração de IA: {(error as Error)?.message || 'Erro desconhecido'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="ai-content-generator">
      <CardHeader>
        <CardTitle>Gerador de Conteúdo com IA</CardTitle>
        <CardDescription>
          Crie conteúdo otimizado para diversas finalidades com o poder da inteligência artificial.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AIConfigWarning isConfigured={aiConfigured} />
        
        {!aiConfigured && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              As configurações de IA não foram encontradas ou estão incompletas. Verifique sua chave de API na seção de Configurações.
            </AlertDescription>
          </Alert>
        )}
        
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
});

AIContentGenerator.displayName = 'AIContentGenerator';

export default AIContentGenerator;
