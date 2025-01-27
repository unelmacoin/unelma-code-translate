import { OpenAIModel, xAI } from '@/types/types';
import { FC } from 'react';

interface Props {
  model: OpenAIModel | xAI;
  onChange: (model: OpenAIModel | xAI) => void;
  isDark: boolean;
}

export const ModelSelect: FC<Props> = ({ model, onChange, isDark }) => {
  const bg = isDark ? 'bg-[#1A1B26]' : 'bg-[#fff]';
  const textColor = isDark ? 'text-neutral-200 ' : 'text-black';
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as OpenAIModel | xAI);
  };

  return (
    <select
      className={`${bg} ${textColor} h-[40px] w-fit rounded-md px-4 py-2`}
      value={model}
      onChange={handleChange}
    >
      <option value="gpt-3.5-turbo">GPT-3.5</option>
      <option value="gpt-4">GPT-4</option>
      <option value="gpt-4-turbo">GPT-4-Turbo</option>
      <option value="gpt-4o">GPT-4o</option>
      <option value="gpt-4o-mini">GPT-4o mini</option>
      <option value="o1-preview">GPT-o1-preview</option>
      <option value="o1-mini">GPT-o1-mini</option>
      <option value="grok-2-latest">Grok-2-Latest</option>
    </select>
  );
};
