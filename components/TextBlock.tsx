"use client"
import { useSpeech } from "@/hooks/useSpeech";
import { useEffect, useRef} from "react";
import { IoMdMic, IoMdMicOff } from "react-icons/io";

interface Props {
  text: string;
  editable?: boolean;
  onChange?: (value: string) => void;
  isDark: boolean;
  maxCharacterCount: number;
}

export const TextBlock: React.FC<Props> = ({
  text,
  editable = false,
  onChange = () => {},
  isDark,
  maxCharacterCount = 5000,
}) => {
  const bg = isDark ? 'bg-[#1A1B26]' : 'bg-[#fff]';
  const textColor = isDark ? 'text-neutral-200 ' : 'text-black';
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editable && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editable]);

  const { textSpeech, isListening, handleListening } = useSpeech();

  useEffect(() => {
    if (textSpeech && text !== textSpeech) {
      onChange(textSpeech);
    }
  }, [textSpeech, text, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    onChange(value);
  };

  return (
    <div className="relative">
        <button onClick={handleListening}>
          {isListening ? (
            <IoMdMic className="absolute bottom-3 right-24" size={32} title="Click to stop voice input" />
          ) : (
            <IoMdMicOff className="absolute bottom-3 right-24" size={32} title="Click to start voice input, currently doesn't support on firefox" />
          )}
        </button>
      <textarea
        ref={textareaRef}
        className={`min-h-[500px] ${bg} w-full p-4 text-[15px] focus:outline-none ${textColor} transition-all duration-300`}
        style={{ resize: 'none' }}
        value={text}
        onChange={handleInputChange}
        disabled={!editable}
        maxLength={maxCharacterCount}
        autoFocus={true}
      />

      {editable && (
        <div className="flex justify-end absolute bottom-2 right-3">
          {`${text.length}/${maxCharacterCount}`}
        </div>
      )}
    </div>
  );
};