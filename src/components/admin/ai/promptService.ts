
import { ContentPrompt } from "./types";

// Format prompt based on content type
export const formatPrompt = (prompt: ContentPrompt): string => {
  const { type, topic, keywords, targetAudience, tone, length, additionalInstructions } = prompt;
  
  let formattedPrompt = '';
  
  switch (type) {
    case 'blog':
      formattedPrompt = `Crie um artigo para o blog sobre "${topic || 'o tópico especificado'}".`;
      if (keywords && keywords.length) {
        formattedPrompt += ` Inclua as seguintes palavras-chave: ${keywords.join(', ')}.`;
      }
      break;
    case 'course':
      formattedPrompt = `Crie uma descrição de curso sobre "${topic || 'o tópico especificado'}"`;
      break;
    case 'seo':
      formattedPrompt = `Gere uma otimização SEO para o conteúdo sobre "${topic || 'o tópico especificado'}"`;
      if (keywords && keywords.length) {
        formattedPrompt += ` com foco nas palavras-chave: ${keywords.join(', ')}.`;
      }
      break;
    case 'dashboard':
      formattedPrompt = `Crie uma análise de KPIs para um dashboard sobre "${topic || 'métricas de desempenho'}"`;
      break;
  }
  
  if (targetAudience) {
    formattedPrompt += ` O público-alvo é: ${targetAudience}.`;
  }
  
  if (tone) {
    formattedPrompt += ` Use um tom ${tone === 'formal' ? 'formal' : 
                              tone === 'casual' ? 'casual' : 
                              tone === 'technical' ? 'técnico' : 'amigável'}.`;
  }
  
  if (length) {
    formattedPrompt += ` O conteúdo deve ser ${length === 'short' ? 'curto' : 
                               length === 'medium' ? 'de tamanho médio' : 'longo'}.`;
  }
  
  if (additionalInstructions) {
    formattedPrompt += ` ${additionalInstructions}`;
  }
  
  return formattedPrompt;
};
