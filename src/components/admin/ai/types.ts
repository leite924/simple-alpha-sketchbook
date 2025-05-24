
export type AIProvider = 'openai' | 'perplexity' | null;
export type AIModel = string;

export interface AIConfig {
  provider: AIProvider;
  model: AIModel;
  apiKey: string;
  lastUpdated?: string;
  updatedBy?: string;
}

export interface AIContent {
  id?: string;
  title: string;
  content: string;
  createdAt?: string;
  generatedBy?: string;
}

export interface AIPrompt {
  id?: string;
  prompt: string;
  template?: string;
  category?: string;
}
