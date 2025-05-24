
export interface ContentPrompt {
  id?: string;
  title?: string;
  content?: string;
  type: 'blog' | 'course' | 'seo' | 'dashboard';
  createdAt?: Date;
  topic?: string;
  keywords?: string[];
  targetAudience?: string;
  tone?: string;
  length?: string;
  additionalInstructions?: string;
}

export interface AIResponse {
  content: string;
  type: string;
  model: string;
  timestamp: Date;
  metadata?: any;
}

export interface AIProvider {
  name: string;
  apiKey: string;
  models: string[];
}

export interface AIConfig {
  provider: string;
  model: string;
  apiKey: string;
  lastUpdated?: Date;
  updatedBy?: string;
}

export type AIModel = string;
