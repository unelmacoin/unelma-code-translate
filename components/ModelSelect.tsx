import { OpenAIModel } from '@/types/types';
import { FC } from 'react';

interface Props {
  model: OpenAIModel;
  onChange: (model: OpenAIModel) => void;
  isDark: boolean;
}

export const ModelSelect: FC<Props> = ({ model, onChange, isDark }) => {
  const bg = isDark ? 'bg-[#1A1B26]': 'bg-[#fff]';
  const textColor = isDark ? 'text-neutral-200 ': 'text-black';
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as OpenAIModel);
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
      <option value="gpt-4-0125-preview">GPT-4-0125-Preview</option>
    </select>
  );
};
