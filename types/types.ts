export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4';

export interface TranslateBody {
  inputLanguage: number;
  outputLanguage: number;
  inputCode: string;
  model: OpenAIModel;
  apiKey: string;
}

export interface TranslateResponse {
  code: string;
}
