
export interface ContentPrompt {
  id: string;
  title: string;
  content: string;
  type: 'blog' | 'course' | 'email' | 'social';
  createdAt: Date;
}

export interface AIResponse {
  content: string;
  type: string;
  model: string;
  timestamp: Date;
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
}
