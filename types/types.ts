export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-0125-preview' | 'o1-preview' | 'o1-mini' | 'o3-mini' | 'gpt-4.5-preview' | 'gpt-5';
export type xAI = 'grok-2-latest' | 'grok-3-mini-beta' | 'grok-3-latest' | 'grok-4-fast-non-reasoning-latest';
export type OpenAI = 'deepseek-chat';

export interface TranslateBody {
  inputLanguage: string;
  outputLanguage: string;
  inputCode: string;
  model: OpenAIModel | xAI | OpenAI;
  apiKey: string;
}

export interface TranslateResponse {
  code: string;
}
