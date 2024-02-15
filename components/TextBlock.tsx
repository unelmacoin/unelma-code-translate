import { useEffect } from "react";

interface Props {
  text: string;
  editable?: boolean;
  onChange?: (value: string) => void;
  isDark:boolean;
  maxCharacterCount:number;
}

export const TextBlock: React.FC<Props> = ({
  text,
  editable = false,
  onChange = () => {},
  isDark,
  maxCharacterCount = 5000,
}) => {
  const bg = isDark ? 'bg-[#1A1B26]': 'bg-[#fff]';
  const textColor = isDark ? 'text-neutral-200 ': 'text-black';

  return (
    <div className="relative">
      <textarea
        className={`min-h-[500px] ${bg} w-full p-4 text-[15px] focus:outline-none ${textColor} transition-all duration-300`}
        style={{ resize: 'none' }}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        disabled={!editable}
        maxLength={5000}
      />
      {editable && (
      <div
        className="flex justify-end absolute bottom-2 right-3"
      >
        {`${text.length}/${maxCharacterCount}`}
      </div>
      )}
    </div>
  );
};
