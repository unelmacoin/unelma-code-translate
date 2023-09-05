interface Props {
  text: string;
  editable?: boolean;
  onChange?: (value: string) => void;
  isDark:boolean;
}

export const TextBlock: React.FC<Props> = ({
  text,
  editable = false,
  onChange = () => {},
  isDark,
}) => {
  const bg = isDark ? 'bg-[#1A1B26]': 'bg-[#d7d4d7]';
  const textColor = isDark ? 'text-neutral-200 ': 'text-black';
  return (
    <textarea
      className={`min-h-[500px] ${bg} w-full p-4 text-[15px] focus:outline-none ${textColor} transition-all duration-300`}
      style={{ resize: 'none' }}
      value={text}
      onChange={(e) => onChange(e.target.value)}
      disabled={!editable}
    />
  );
};
