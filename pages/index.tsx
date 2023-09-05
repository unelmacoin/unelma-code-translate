import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect } from '@/components/LanguageSelect';
import { ModelSelect } from '@/components/ModelSelect';
import { TextBlock } from '@/components/TextBlock';
import ThemeButton from '@/components/ThemeButton';
import { OpenAIModel, TranslateBody } from '@/types/types';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { IoMdSwap } from 'react-icons/io';

export default function Home() {
  const [inputLanguage, setInputLanguage] = useState<string>('Natural Language');
  const [outputLanguage, setOutputLanguage] = useState<string>('Python');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [isDark,setIsDark] = useState<boolean>(true);

  const handleTranslate = async () => {
    const maxCodeLength = model === 'gpt-3.5-turbo' ? 6000 : 12000;

    if (inputLanguage === outputLanguage) {
      alert('Please select different languages.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();

    const body: TranslateBody = {
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey,
    };

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    setHasTranslated(true);
    copyToClipboard(code);
  };

  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleTranslate();
    }, 2000)

    return () => clearTimeout(delayDebounceFn)
  }, [outputLanguage, inputCode]);

  useEffect(() => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);

  const handleSwap = () => {
    setInputLanguage(outputLanguage);
    setOutputLanguage(inputLanguage);
    setInputCode(outputCode);
    setOutputCode(inputCode)
  };
const toggleDarkMode = () => {
setIsDark(!isDark)
localStorage.setItem('unelTheme', JSON.stringify(isDark));
}
  // const bg = isDark ? 'bg-[#1F2937] ': 'bg-[#FFFFFF]';
  // const text = isDark ? 'text-neutral-200 ': 'text-black';
  
  return (
    <div className = {isDark ? 'text-neutral-200 bg-[#0E1117] transition-all duration-300': 'bg-[#FFFFFF] text-black transition-all duration-300'}>
      <Head>
        <title>Unelma-Code Translator</title>
        <meta
          name="description"
          content="Use AI to translate code from one language to another."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
      <div className="flex h-full min-h-screen flex-col items-center px-4 pb-20 sm:px-10">
        <div className='flex flex-row-reverse w-11/12'>
      <ThemeButton 
          isDark = {isDark}
          toggleDarkMode = {toggleDarkMode}
      />
        </div>
        <div className="mt-10 flex flex-col items-center justify-center sm:mt-20">
          <div className="text-4xl font-bold">Unelma-Code Translator</div>
        </div>

        <div className="mt-2 flex items-center space-x-2">
          <ModelSelect model={model} onChange={(value) => setModel(value)} />
        </div>

        <div className="mt-2 text-center text-xs">
          {loading
            ? 'Translating...'
            : hasTranslated
              ? 'Output copied to clipboard!'
              : 'Enter some code in Input'}
        </div>

        <div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="max-h-200 flex flex-col  space-y-2 sm:w-2/4">
            <div className="text-center text-xl font-bold">Input</div>
 

            <LanguageSelect
              language={inputLanguage}
              onChange={(value) => {
                setInputLanguage(value);
                setHasTranslated(false);
                setInputCode('');
                setOutputCode('');
              }}
              isDark = {isDark}
            />

            {inputLanguage === 'Natural Language' ? (
              <TextBlock
              isDark={isDark}
                text={inputCode}
                editable={!loading}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);
                }}
              />
            ) : (
              <CodeBlock
                code={inputCode}
                editable={!loading}
                isDark = {isDark}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);

                }}
              />
            )}
          </div>
          <IoMdSwap onClick={handleSwap} className='mt-10  text-neutral-200 text-3xl cursor-pointer hover:opacity-80'/>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="text-center text-xl font-bold">Output</div>

            <LanguageSelect
              language={outputLanguage}
              onChange={(value) => {
                setOutputLanguage(value);
                setOutputCode('');
              }}
              isDark = {isDark}
            />

            {outputLanguage === 'Natural Language' ? (
              <TextBlock text={outputCode}   isDark = {isDark}/>
            ) : (
              <CodeBlock code={outputCode}   isDark = {isDark} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
