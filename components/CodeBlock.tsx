import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import CodeMirror from '@uiw/react-codemirror';
import { FC, useEffect, useState } from 'react';
import {EditorView} from "@codemirror/view"
import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

interface Props {
  code: string;
  editable?: boolean;
  onChange?: (value: string) => void;
  isDark:boolean;
}

let myTheme = EditorView.theme({
  "&": {
    color:"#034" ,
    backgroundColor: "#fff",
  },
  ".cm-content": {
    caretColor: "#0e9"
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#000"
  },
  ".cm-gutters": {
    backgroundColor: "#fff",
    color: "black",
    border: "none"
  }
})

export const CodeBlock: FC<Props> = ({
  code,
  editable = false,
  onChange = () => {},
  isDark,
}) => {
  const [copyText, setCopyText] = useState<string>('Copy');
  const [copyError, setCopyError] = useState<string | null>(null);
  const bg = isDark
    ? 'bg-[#1A1B26] hover:bg-[#2D2E3A] active:bg-[#2D2E3A]'
    : 'bg-[#FFFFFF]';
  const text = isDark ? 'text-white ' : 'text-black';

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopyText('Copy');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copyText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyText('Copied!');
      setCopyError(null);
      toast.info('Output copied to clipboard');
    } catch (error) {
      setCopyError('Copy failed');
    }
  };

  return (
    <div className="relative">
      <button
        className={`absolute right-0 top-0 z-10 rounded  p-1 text-xs ${text}${bg} `}
        onClick={handleCopy}
      >
        {copyText}
      </button>
      {copyError && <p>{copyError}</p>}
      <CodeMirror
        editable={editable}
        value={code}
        height="500px"
        extensions={[StreamLanguage.define(go)]}
        theme={isDark ? tokyoNight : myTheme}
        onChange={(value) => onChange(value)}
        data-testid="code"      
      />
    </div>
  );
};
