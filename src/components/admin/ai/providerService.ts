
import { toast } from "sonner";
import { AIConfig, AIResponse } from "./types";

// Generate content with OpenAI
export const generateWithOpenAI = async (config: AIConfig, prompt: string): Promise<AIResponse | null> => {
  try {
    const startTime = Date.now();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: 'Você é um assistente especializado em criar conteúdo educacional de alta qualidade.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });
    
    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      toast.error(`Erro na API OpenAI: ${data.error?.message || 'Erro desconhecido'}`);
      return null;
    }
    
    return {
      content: data.choices[0].message.content,
      metadata: {
        tokens: data.usage?.total_tokens,
        processingTime,
      }
    };
  } catch (error) {
    console.error('Error with OpenAI generation:', error);
    toast.error('Falha ao gerar com OpenAI');
    return null;
  }
};

// Generate content with Perplexity
export const generateWithPerplexity = async (config: AIConfig, prompt: string): Promise<AIResponse | null> => {
  try {
    const startTime = Date.now();
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: 'Você é um assistente especializado em criar conteúdo educacional de alta qualidade.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });
    
    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    if (!response.ok) {
      console.error('Perplexity API error:', data);
      toast.error(`Erro na API Perplexity: ${data.error?.message || 'Erro desconhecido'}`);
      return null;
    }
    
    return {
      content: data.choices[0].message.content,
      metadata: {
        processingTime,
      }
    };
  } catch (error) {
    console.error('Error with Perplexity generation:', error);
    toast.error('Falha ao gerar com Perplexity');
    return null;
  }
};
