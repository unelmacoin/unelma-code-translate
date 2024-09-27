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
import Tesseract from 'tesseract.js';
import UploadImagesAndFiles from '@/components/UploadImagesAndFiles';
import { languages } from '@/components/LanguageSelect';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Feedback } from '@/components/Feedback';
import SweetAlert from '@/components/SweetAlert';
require('dotenv').config();

export default function Home() {
  const [inputLanguage, setInputLanguage] =
    useState<string>('Natural Language');
  const [outputLanguage, setOutputLanguage] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [history, setHistory] = useState<Set<string>>(new Set());
  const [historyExpand, setHistoryExpand] = useState<boolean>(false);

  useEffect(() => {
    toast.info('Enter or upload some code in Input');
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('unelTheme');
    if (storedTheme !== null) {
      setIsDark(JSON.parse(storedTheme));
    }
  }, []);

  const handleHistoryExpand = (value: boolean) => {
    console.log('History expanded:', value);
    /*setHasTranslated(false); 
    setHistoryExpand(value);   */
  };

  const handleTranslate = async () => {
    if (inputLanguage === outputLanguage) {
      alert('Please select different languages.');
      return;
    }
    if (inputCode.trim() !== '' && outputLanguage === '') {
      Swal.fire({
        icon: 'error',
        text: 'Please select the output language',
        width: '250px',
      });
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
    copyToClipboard(code);
    setHasTranslated(true);

    const updatedHistory = new Set([...history, inputCode]);
    const mergedHistory = new Set([
      ...updatedHistory,
      ...JSON.parse(localStorage.getItem('userHistory') || '[]'),
    ]);
    setHistory(mergedHistory);
    localStorage.setItem('userHistory', JSON.stringify([...mergedHistory]));
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
    }, 5000);

    return () => clearTimeout(delayDebounceFn);
  }, [outputLanguage, inputCode, model]);

  useEffect(() => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);

  useEffect(() => {
    if (inputCode.trim() !== '' && loading) {
      toast.info('Translating...');
    }
  }, [loading]);

  const handleUpload = (file: File) => {
    if (
      file.type === 'application/zip' ||
      file.type === 'application/x-rar-compressed' ||
      file.type === 'application/x-tar' ||
      file.name.endsWith('.zip') ||
      file.name.endsWith('.rar') ||
      file.name.endsWith('.tar')
    ) {
      Swal.fire({
        icon: 'error',
        text: 'You cannot upload zip folders at the moment!',
      });
      return;
    }
    const reader = new FileReader();
    setHasTranslated(!hasTranslated);
    reader.onload = async (event) => {
      if (file.type.startsWith('image/')) {
        const imageData = event.target?.result as ArrayBuffer;
        const blob = new Blob([imageData], { type: 'image/*' });
        const imageUrl = URL.createObjectURL(blob);

        const {
          data: { text },
        } = await Tesseract.recognize(imageUrl, 'eng');
        setInputCode(text);
        setInputLanguage('Natural Language');
        URL.revokeObjectURL(imageUrl);
      } else {
        setInputCode(event.target?.result as string);
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (fileExtension) {
          const detectedLanguage = languages.find(
            (lang) => lang.value.toLowerCase() === fileExtension,
          );
          if (detectedLanguage) {
            setInputLanguage(detectedLanguage.value);
            setOutputLanguage('Natural Language');
          } else {
            setInputLanguage('Natural Language');
          }
        }
      }
    };

    if (file.type.startsWith('image/')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

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

  const handleHistorySelect = (value: string) => {
    setInputCode(value);
    setHasTranslated(false);
  };

  const bodyBg = isDark === true ? '#000' : '#E0E0E0';
  const navBg = isDark === true ? '#333333' : '#E8EBF5';

  const changeBodyBackgroundColor = (color: any) => {
    document.body.style.backgroundColor = color;
  };

  useEffect(() => {
    const backgroundColor = isDark ? '#131416' : '#fff';
    changeBodyBackgroundColor(backgroundColor);
  }, [isDark]);

  useEffect(() => {
    const handleSwap = () => {
      setInputLanguage(outputLanguage);
      setOutputLanguage(inputLanguage);
      setInputCode(outputCode);
      setOutputCode(inputCode);
    };
    const handleKeyboardShortcut = (event: any) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key.toUpperCase() === 'S'
      ) {
        handleSwap();
      }
    };
    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcut);
    };
  }, [inputCode, inputLanguage, outputCode, outputLanguage]);

  useEffect(() => {
    if (outputCode.trim() !== '' && hasTranslated) {
      toast.success('Your code is translated');
    }
  }, [hasTranslated]);

  return (
    <div style={{ background: bodyBg }}>
      <div
        style={{ background: navBg }}
        className={`fixed top-0 z-50 bg-black ${
          isDark
            ? ' w-full  py-4 text-white transition-all duration-300'
            : 'w-full  py-4  transition-all duration-300'
        }`}
      >
        {' '}
        <Nav isDark={isDark} toggleDarkMode={toggleDarkMode} />
      </div>

      <div
        className={
          isDark
            ? ' text-neutral-200 transition-all duration-300'
            : ' text-black transition-all duration-300'
        }
      >
        <Head>
          <title className="pt-2">Unelma-Code Translator</title>
          <meta
            name="description"
            content="Use AI to translate code from one language to another."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div
          className={`flex h-full min-h-fit flex-col flex-wrap px-4 pb-20 pt-4 sm:px-10 md:pt-16 ${
            historyExpand ? '' : 'items-center'
          }`}
        >
          <div
            className={`flex flex-col ${
              historyExpand ? 'md:items-start' : ''
            }justify-center mt-20 md:mt-10 lg:mt-10`}
          >
            <div className="text-4xl font-bold">Code Translator</div>
          </div>

          <div
            className={`mt-2 flex ${
              historyExpand ? 'itmes-start lg:items-center' : 'items-center'
            }justify-center  space-x-2`}
          >
            <ModelSelect
              model={model}
              isDark={isDark}
              onChange={(value) => setModel(value)}
            />
          </div>
          <div className={`mt-2 ${historyExpand ? '' : 'text-center'} text-xs`}>
            {inputCode.trim() !== '' && loading
              ? 'Translating...'
              : outputCode.trim() !== '' && hasTranslated
              ? 'Your code has been translated!'
              : 'Enter some code in Input'}
          </div>

          <div
            className={`mt-6 flex w-full max-w-[1200px] flex-col justify-center sm:space-x-4 lg:flex-row ${
              historyExpand
                ? 'items-center md:flex-col md:items-start lg:w-2/3'
                : 'md:flex-row'
            }`}
          >
            <div className="max-h-200 flex w-full flex-col space-y-2 sm:w-2/4">
              <div className="flex space-x-4">
                <UploadImagesAndFiles onUpload={handleUpload} />
                <HistoryButton
                  onSelect={handleHistorySelect}
                  onExpand={handleHistoryExpand}
                  isDark={isDark}
                />
              </div>
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
                    `${inputCode.length}/5000`;
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
            <div>
              <IoMdSwap
                title="Swap languages (Cmd + Shift + S)"
                onClick={handleSwap}
                className={`${
                  historyExpand ? 'lg:mt-20' : ' mt-0 md:mt-20 lg:mt-20'
                } w-12 cursor-pointer items-center text-3xl hover:opacity-80 ${
                  isDark ? 'text-white-700' : 'text-black'
                }`}
              />
            </div>
            <div className="flex h-full w-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
              <div
                className={`text-center ${
                  historyExpand ? 'lg:mt-10' : 'mt-0 md:mt-10 lg:mt-10'
                } text-xl font-bold`}
              >
                Output
              </div>

              <LanguageSelect
                language={outputLanguage}
                onChange={(value) => {
                  setOutputLanguage(value);
                  setOutputCode('');
                }}
                isDark={isDark}
              />

              {outputLanguage === 'Natural Language' ? (
                <TextBlock
                  text={outputCode}
                  isDark={isDark}
                  maxCharacterCount={5000}
                />
              ) : (
                <CodeBlock code={outputCode} isDark={isDark} />
              )}
              <div className="">
                <Feedback />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer isDark={isDark} />
      <ToastContainer autoClose={2000} style={{ top: '5rem' }} />
    </div>
  );
}
