
import { toast } from "sonner";
import { ContentPrompt, AIResponse, AIConfig } from "./types";
import { getAIConfig } from "./configService";
import { formatPrompt } from "./promptService";
import { generateWithOpenAI, generateWithPerplexity } from "./providerService";

// Generate content using configured AI model
export const generateContent = async (prompt: ContentPrompt): Promise<AIResponse | null> => {
  try {
    const config = await getAIConfig();
    
    if (!config || !config.apiKey || !config.model || !config.provider) {
      toast.error('Configurações de IA incompletas. Configure através do painel de administrador.');
      return null;
    }
    
    // Format the prompt based on content type
    const formattedPrompt = formatPrompt(prompt);
    
    if (config.provider === 'openai') {
      return await generateWithOpenAI(config, formattedPrompt);
    } else if (config.provider === 'perplexity') {
      return await generateWithPerplexity(config, formattedPrompt);
    } else {
      toast.error('Provedor de IA não suportado');
      return null;
    }
  } catch (error) {
    console.error('Error generating content:', error);
    toast.error('Falha ao gerar conteúdo com IA');
    return null;
  }
};
