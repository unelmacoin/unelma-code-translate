import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect } from '@/components/LanguageSelect';
import { ModelSelect } from '@/components/ModelSelect';
import { TextBlock } from '@/components/TextBlock';
import { OpenAIModel, TranslateBody } from '@/types/types';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { IoMdSwap } from 'react-icons/io';
import ReactDOM from 'react-dom';
import HistoryButton from '@/components/HistoryButton';

export default function Home() {
  const [inputLanguage, setInputLanguage] =
    useState<string>('Natural Language');
  const [outputLanguage, setOutputLanguage] = useState<string>('Python');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [history, setHistory] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedTheme = localStorage.getItem('unelTheme');
    if (storedTheme !== null) {
      setIsDark(JSON.parse(storedTheme));
    }
  }, []);

 

  const handleTranslate = async () => {

     if (inputLanguage === outputLanguage) {
       alert('Please select different languages.');
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
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
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
    setOutputCode(inputCode);
  };
  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('unelTheme', JSON.stringify(newIsDark));
  };

  const handleSave = () =>{
    setHistory((prevHistory) => {
      const newHistory = new Set(prevHistory);
      newHistory.add(inputCode);
      return newHistory;
    });
  }
  const handleHistorySelect = (value:string) =>{
  setInputCode(value)
  }

  const bodyBg =
    isDark === true
      ? 'linear-gradient(130deg, #ad90c1 0%, rgb(3, 0, 84) 100%), linear-gradient(130deg, #09007b 0%, rgba(15, 0, 66, 0) 30%), linear-gradient(129.96deg, rgb(255, 47, 47) 10.43%, rgb(0, 4, 96) 92.78%), radial-gradient(100% 246.94% at 100% 0%, rgb(255, 255, 255) 0%, rgba(37, 0, 66, 0.8) 100%), linear-gradient(121.18deg, rgb(20, 0, 255) 0.45%, rgb(27, 0, 62) 100%), linear-gradient(154.03deg, rgb(206, 0, 0) 0%, rgb(255, 0, 61) 74.04%), linear-gradient(341.1deg, rgb(178, 91, 186) 7.52%, rgb(16, 0, 119) 77.98%), linear-gradient(222.34deg, rgb(169, 0, 0) 12.99%, rgb(0, 255, 224) 87.21%), linear-gradient(150.76deg, rgb(183, 213, 0) 15.35%, rgb(34, 0, 170) 89.57%)'
      : 'linear-gradient(125.95deg, #C700BF 10.95%, #7DA900 100%), linear-gradient(341.1deg, #00C2FF 7.52%, #4E00B1 77.98%), linear-gradient(222.34deg, #A90000 12.99%, #00FFE0 87.21%), linear-gradient(130.22deg, #8FA600 18.02%, #5A31FF 100%)';
  const navBg = '#00000021';

  const changeBodyBackgroundColor = (color:any) => {
    document.body.style.backgroundColor = color;
  };

  useEffect(() => {
    const backgroundColor = isDark ? '#131416' : '#fff';
    changeBodyBackgroundColor(backgroundColor);
  }, [isDark]);

  return (

    <div
     style={{ background: bodyBg}}>
      <div
        style={{ background: navBg }}
        className={` ${
          isDark
            ? ' py-4 text-white transition-all duration-300'
            : 'py-4  transition-all duration-300'
        }`}
      >
        {' '}
        <Nav isDark={isDark} />
      </div>

      <div
        className={
          isDark
            ? ' text-neutral-200 transition-all duration-300'
            : ' text-black transition-all duration-300'
        }
      >
        <Head >
          <title className="pt-2">Unelma-Code Translator</title>
          <meta
            name="description"
            content="Use AI to translate code from one language to another."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="flex h-full min-h-fit flex-col items-center px-4 pb-20 sm:px-10">
          <div className="mt-10 flex flex-col items-center justify-center sm:mt-20">
            <div className="text-4xl font-bold">Unelma-Code Translator</div>
          </div>

          <div className="mt-2 flex items-center space-x-2">
            <ModelSelect
              model={model}
              isDark={isDark}
              onChange={(value) => setModel(value)}
            />
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
                isDark={isDark}
              />

              {inputLanguage === 'Natural Language' ? (
                <TextBlock
                  isDark={isDark}
                  text={inputCode}
                  editable={!loading}
                  maxCharacterCount={5000}
                  onChange={(value) => {
                    setInputCode(value);
                    setHasTranslated(false);
                  }}
                />
              ) : (
                <CodeBlock
                  code={inputCode}
                  editable={!loading}
                  isDark={isDark}
                  onChange={(value) => {
                    setInputCode(value);
                    setHasTranslated(false);
                  }}
                />
              )}
            </div>
            <IoMdSwap
              onClick={handleSwap}
              className={`mt-10 cursor-pointer text-3xl hover:opacity-80 ${
                isDark ? 'text-white-700' : 'text-black'
              }`}
            />
            <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
              <div className="text-center text-xl font-bold">Output</div>

              <LanguageSelect
                language={outputLanguage}
                onChange={(value) => {
                  setOutputLanguage(value);
                  setOutputCode('');
                }}
                isDark={isDark}
              />

              {outputLanguage === 'Natural Language' ? (
                <TextBlock text={outputCode} isDark={isDark} maxCharacterCount={5000} />
              ) : (
                <CodeBlock code={outputCode} isDark={isDark} />
              )}
            </div>
          </div>
          <div className='flex justify-center mt-4'>
        <HistoryButton onSave={handleSave} history={[...history]} onSelect={handleHistorySelect}/>
      </div>
        </div>
        
      </div>
      <Footer isDark={isDark} toggleDarkMode={toggleDarkMode} />
    </div>
   
  );
}
