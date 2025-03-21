"use client"
import { useSpeech } from "@/hooks/useSpeech";
import { useEffect, useRef, FC } from "react";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { useState } from "react";

interface TextBlockProps {
  text: string;
  editable?: boolean;
  maxCharacterCount?: number;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isDark?: boolean;
}

export const TextBlock: FC<TextBlockProps> = ({
  text,
  editable = true,
  maxCharacterCount,
  onChange = (value: string) => {},
  onFocus = () => {},
  onBlur = () => {},
  isDark = false,
}) => {
  const [characterCount, setCharacterCount] = useState(text.length);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCharacterCount(text.length);
  }, [text]);

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newText = e.target.value;
    
    if (maxCharacterCount && newText.length > maxCharacterCount) {
      newText = newText.substring(0, maxCharacterCount); // Truncate extra characters
    }
    
    onChange(newText);
    setCharacterCount(newText.length);
  };
  
  

  return (
    <div className="relative">
      <button onClick={handleListening}>
        {isListening ? (
          <IoMdMic
            className="absolute bottom-3 right-24"
            size={32}
            title="Click to stop voice input"
          />
        ) : (
          <IoMdMicOff
            className="absolute bottom-3 right-24"
            size={32}
            title="Click to start voice input, currently doesn't support on firefox"
          />
        )}
      </button>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={!editable}
        maxLength={maxCharacterCount}
        className={`min-h-[500px] w-full p-4 text-[15px] transition-all duration-300 focus:outline-none ${
          isDark ? 'bg-[#1A1B26] text-white' : 'bg-[#fff] text-black'
        }`}
        style={{ resize: 'none' }}
      />
      {maxCharacterCount && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {characterCount}/{maxCharacterCount}
        </div>
      )}
    </div>
  );
};