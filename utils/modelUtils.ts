export const RESTRICTED_MODELS = [
  'gpt-4',
  'gpt-4-turbo',
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-0125-preview'
];

export const isRestrictedModel = (model: string): boolean => {
  return RESTRICTED_MODELS.includes(model);
};

export const checkTranslationLimit = (model: string): boolean => {
  if (!isRestrictedModel(model)) return false;
  
  const translationCount = localStorage.getItem(`translation_${model}`) || '0';
  return parseInt(translationCount) >= 5;
};

export const incrementTranslationCount = (model: string): void => {
  if (!isRestrictedModel(model)) return;
  
  const currentCount = parseInt(localStorage.getItem(`translation_${model}`) || '0');
  localStorage.setItem(`translation_${model}`, (currentCount + 1).toString());
};
