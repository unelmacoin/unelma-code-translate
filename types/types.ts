export type OpenAIModel =
  | 'gpt-3.5-turbo'
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-4o'
  | 'gpt-4-0125-preview'
  | 'gpt-4o-mini'
  | 'o1-mini';

export interface TranslateBody {
  inputLanguage: string;
  outputLanguage: string;
  inputCode: string;
  model: OpenAIModel;
  apiKey: string;
}

export interface TranslateResponse {
  code: string;
}
