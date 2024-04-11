import { useSpeech } from "@/hooks/useSpeech";
import { useEffect, useRef, useState } from "react";
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
  const [speechText, setSpeechText] = useState<string>('');

  useEffect(() => {
    if (editable && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editable]);

  const {
    textSpeech,
    isListening,
    handleListening,
    hasRecognitionSupport,
  } = useSpeech();

  useEffect(() => {
    if (textSpeech) {
      setSpeechText(textSpeech);
    }
  }, [textSpeech]);

  useEffect(() => {
    if (text !== speechText) {
      onChange(speechText);
    }
  }, [speechText, text, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSpeechText(value);
    onChange(value);
  };

  return (
    <div className="relative">
      {hasRecognitionSupport ? (
        <button onClick={handleListening}>
          {isListening ? (
            <IoMdMic className="absolute bottom-3 right-20" size={32} title="Click to stop voice input" />
          ) : (
            <IoMdMicOff className="absolute bottom-3 right-20" size={32} title="Click to start voice input" />
          )}
        </button>
      ):(
        <h1>Your browser does not support voice recognition</h1>
      )}
      <textarea
        ref={textareaRef}
        className={`min-h-[500px] ${bg} w-full p-4 text-[15px] focus:outline-none ${textColor} transition-all duration-300`}
        style={{ resize: 'none' }}
        value={text || speechText}
        onChange={handleInputChange}
        disabled={!editable}
        maxLength={maxCharacterCount}
        autoFocus={true}
      />

      {editable && (
        <div className="flex justify-end absolute bottom-2 right-3">
          {`${(text.length || speechText.length)}/${maxCharacterCount}`}
        </div>
      )}
    </div>
  );
};