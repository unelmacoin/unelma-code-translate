export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'GPT-4-o' |'gpt-4-0125-preview'|  'o1-mini';
export type xAI = 'grok-2-latest';

export interface TranslateBody {
  inputLanguage: string;
  outputLanguage: string;
  inputCode: string;
  model: OpenAIModel | xAI;
  apiKey: string;
}

export interface TranslateResponse {
  code: string;
}
