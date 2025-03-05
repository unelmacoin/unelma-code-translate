import { OpenAIModel, xAI, OpenAI } from '@/types/types';
import { FC } from 'react';

interface Props {
  model: OpenAIModel | xAI | OpenAI;
  onChange: (model: OpenAIModel | xAI | OpenAI) => void;
  isDark: boolean;
}

export const ModelSelect: FC<Props> = ({ model, onChange, isDark }) => {
  const bg = isDark ? 'bg-[#1A1B26]' : 'bg-[#fff]';
  const textColor = isDark ? 'text-neutral-200 ' : 'text-black';

  return (
    <select
      className={`${bg} ${textColor} h-[40px] w-fit rounded-md px-4 py-2`}
      value={model}
      onChange={(e) => onChange(e.target.value as OpenAIModel | xAI | OpenAI)}
    >
      <option value="gpt-3.5-turbo">GPT-3.5</option>
      <option value="gpt-4">GPT-4</option>
      <option value="gpt-4-turbo">GPT-4-Turbo</option>
      <option value="gpt-4o">GPT-4o</option>
      <option value="gpt-4o-mini">GPT-4o Mini</option>
      <option value="o1-preview">GPT-o1-Preview</option>
      <option value="gpt-4.5-preview">GPT-4.5</option>
      <option value="o1-mini">GPT-o1-Mini</option>
      <option value="o3-mini">GPT-o3-mini</option>
      <option value="grok-2-latest">Grok-2-Latest</option>
      <option value="deepseek-chat">DeepSeek</option>
    </select>
  );
};
