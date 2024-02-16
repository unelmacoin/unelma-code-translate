import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import CodeMirror from '@uiw/react-codemirror';
import { FC, useEffect, useState } from 'react';
import {EditorView} from "@codemirror/view"

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
  isDark
}) => {
  const [copyText, setCopyText] = useState<string>('Copy');
  const bg = isDark ? 'bg-[#1A1B26] hover:bg-[#2D2E3A] active:bg-[#2D2E3A]': 'bg-[#FFFFFF]';
  const text = isDark ? 'text-white ': 'text-black';
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopyText('Copy');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copyText]);

  return (
    <div className="relative">
      <button
        className={`absolute right-0 top-0 z-10 rounded  p-1 text-xs ${text}${bg} `}
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopyText('Copied!');
        }}
      >
        {copyText}
      </button>
      <CodeMirror
        editable={editable}
        value={code}
        height="500px"
        extensions={[StreamLanguage.define(go)]}
        theme={isDark ? tokyoNight : myTheme}
        onChange={(value) => onChange(value)}      
      />
      
    </div>
  );
};
