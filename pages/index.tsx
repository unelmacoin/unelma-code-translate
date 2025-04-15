import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect } from '@/components/LanguageSelect';
import { ModelSelect } from '@/components/ModelSelect';
import { TextBlock } from '@/components/TextBlock';
import { OpenAIModel, xAI, OpenAI, TranslateBody } from '@/types/types';
import Head from 'next/head';
import { useEffect, useState, useCallback, useRef } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { IoMdSwap } from 'react-icons/io';
import HistoryButton from '@/components/HistoryButton';
import Tesseract from 'tesseract.js';
import UploadImagesAndFiles from '@/components/UploadImagesAndFiles';
import { languages } from '@/components/LanguageSelect';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Feedback } from '@/components/Feedback';
import SweetAlert from '@/components/SweetAlert';
import { useTranslationLimit } from '../hooks/useTranslationLimit';
import RestrictedModelModal from '../components/RestrictedModelModal';
import { useTheme } from '../contexts/ThemeContext';
require('dotenv').config();

type AnyFunction = (...args: any[]) => any;

interface DebouncedFunction<T extends AnyFunction> {
  (...args: Parameters<T>): ReturnType<T>;
  cancel: () => void;
}

function debounce<T extends AnyFunction>(fn: T, delay: number): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout | null = null;

  // Define the debounced function
  function debouncedFunction(this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
    const later = () => {
      timeoutId = null;
      return fn.apply(this, args);
    };
    clearTimeout(timeoutId as NodeJS.Timeout);
    timeoutId = setTimeout(later, delay);
    return undefined as any; // TypeScript doesn't like void return here
  }

  // Add cancel method to the debounced function
  const debouncedWithCancel: DebouncedFunction<T> = Object.assign(debouncedFunction, {
    cancel: function () {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
  });

  return debouncedWithCancel;
}
export default function Home() {
  const { isDark, toggleDarkMode } = useTheme();
  const [inputLanguage, setInputLanguage] =
    useState<string>('Natural Language');
  const [outputLanguage, setOutputLanguage] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel | xAI | OpenAI>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [history, setHistory] = useState<Set<string>>(new Set());
  const [historyExpand, setHistoryExpand] = useState<boolean>(false);
  const translateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showLimitModal, setShowLimitModal, checkAndIncrementLimit } = useTranslationLimit(model);

  useEffect(() => {
    toast.info('Enter or upload some code in Input');
  }, []);

  const handleHistoryExpand = () => {
    setHistoryExpand(!historyExpand);
  };

  const handleTranslate = useCallback(async () => {
    if (!checkAndIncrementLimit()) {
      return;
    }
    if (loading) return; // Prevent multiple translations
    if (inputLanguage === outputLanguage) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select different languages.',
      });
      return;
    }

    if (inputCode.trim() === '' || outputLanguage === '') {
      if (inputCode.trim() === '') {
        Swal.fire({
          icon: 'info',
          title: 'Notice',
          text: 'Please enter some code to translate.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select the output language.',
        });
      }
      return;
    }

    setLoading(true);
    setOutputCode('');
    setHasTranslated(false); // Set to false before starting translation

    try {
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
        throw new Error('Something went wrong with the translation.');
      }

      const data = response.body;

      if (!data) {
        throw new Error('No data received from translation API.');
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

      copyToClipboard(code);
      setHasTranslated(true);

      const updatedHistory = new Set([
        ...history,
        JSON.stringify({ inputCode, inputLanguage, outputLanguage, model })
      ]);
      const mergedHistory = new Set([
        ...updatedHistory,
        ...JSON.parse(localStorage.getItem('userHistory') || '[]').map((item: string) => {
          try {
            return JSON.stringify(JSON.parse(item));
          } catch {
            return item;
          }
        }),
      ]);
      setHistory(mergedHistory);
      localStorage.setItem('userHistory', JSON.stringify([...mergedHistory]));
    } catch (error) {
      console.error('Translation error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Translation Failed',
        text: 'Please try again.',
      });
    } finally {
      setLoading(false); // Always ensure loading is set back to false
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputLanguage, outputLanguage, inputCode, model, apiKey, history]);


  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const debouncedTranslate =
    //eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(
      debounce(() => {
        handleTranslate();
      }, 1500),
      [handleTranslate]
    );

  useEffect(() => {
    if (inputCode.trim() !== '' && !loading && !hasTranslated) {
      debouncedTranslate();
    }

    return () => {
      debouncedTranslate.cancel();
    };
  }, [inputCode, loading, hasTranslated, debouncedTranslate]);

  useEffect(() => {
    if (inputCode.trim() !== '' && !loading && !hasTranslated) {
      debouncedTranslate();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, outputLanguage, inputCode, loading, hasTranslated]);

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
  }, [loading, inputCode]);

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
        title: 'Error',
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
    setHasTranslated(false); // Reset translation state when swapping languages
  };

  const handleHistorySelect = useCallback((value: string) => {
    const { inputCode, inputLanguage, outputLanguage, model } = JSON.parse(value);
    setInputCode(inputCode);
    setInputLanguage(inputLanguage);
    setOutputLanguage(outputLanguage);
    setModel(model);
    setHasTranslated(false);
    setHistoryExpand(false); // Close the history field
  }, []);

  const bodyBg = isDark === true ? '#000' : '#E0E0E0';
  const navBg = isDark === true ? '#333333' : '#E8EBF5';

  const changeBodyBackgroundColor = (color: any) => {
    document.body.style.backgroundColor = color;
  };

  useEffect(() => {
    const handleSwap = () => {
      setInputLanguage(outputLanguage);
      setOutputLanguage(inputLanguage);
      setInputCode(outputCode);
      setOutputCode(inputCode);
      setHasTranslated(false); // Reset translation state when swapping languages
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTranslated]);

  return (
    <div style={{ background: bodyBg }}>
      <div
        style={{ background: navBg }}
        className={`fixed top-0 z-50 bg-black ${isDark
            ? ' w-full  py-4 text-white transition-all duration-300'
            : 'w-full  py-4  transition-all duration-300'
          }`}
      >
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
          <title className="pt-0">Unelma-Code Translator</title>
          <meta
            name="description"
            content="Use AI to translate code from one language to another."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div
          className={`flex h-full min-h-fit flex-col flex-wrap px-4 pb-20 pt-4 sm:px-10 md:pt-16 ${historyExpand ? '' : 'items-center'
            }`}
        >
          <div
            className={`flex flex-col ${historyExpand ? 'md:items-start' : ''
              }justify-center mt-16 md:mt-16 lg:mt-16`}
          >
            <div className="text-4xl font-bold mt-20 sm:mt-0">Code Translator</div>
          </div>

          <div
            className={`mt-2 flex ${historyExpand ? 'itmes-start lg:items-center' : 'items-center'
              }justify-center  space-x-2`}
          >
            <ModelSelect
              model={model}
              isDark={isDark}
              onChange={(value) => {
                setModel(value as OpenAIModel | xAI | OpenAI);
                setHasTranslated(false); // Reset translation state when changing model
              }}
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
            className={`mt-6 flex w-full max-w-[1200px] flex-col justify-center sm:space-x-4 lg:flex-row ${historyExpand
                ? 'items-center md:flex-col md:items-start lg:w-2/3'
                : 'md:flex-row'
              }`}
          >
            <div className="flex flex-col w-full space-y-2 max-h-200 sm:w-2/4">
              <div className="flex space-x-4">
                <UploadImagesAndFiles onUpload={handleUpload} />
                <HistoryButton
                  onSelect={handleHistorySelect}
                  onExpand={handleHistoryExpand}
                  isDark={isDark}
                />
              </div>
              <div className="text-xl font-bold text-center">Input</div>

              <LanguageSelect
                language={inputLanguage}
                onChange={(value) => {
                  setInputLanguage(value);
                  setHasTranslated(false);
                  if (value !== 'Natural Language' && inputLanguage === 'Natural Language') {
                    setInputCode('');
                  }
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
                className={`${historyExpand ? 'lg:mt-20' : ' mt-0 md:mt-20 lg:mt-20'
                  } w-12 cursor-pointer items-center text-3xl hover:opacity-80 ${isDark ? 'text-white-700' : 'text-black'
                  }`}
              />
            </div>
            <div className="flex flex-col justify-center w-full h-full space-y-2 sm:mt-0 sm:w-2/4">
              <div
                className={`text-center ${historyExpand ? 'lg:mt-10' : 'mt-0 md:mt-10 lg:mt-10'
                  } text-xl font-bold`}
              >
                Output
              </div>

              <LanguageSelect
                language={outputLanguage}
                onChange={(value) => {
                  setOutputLanguage(value);
                  setOutputCode('');
                  setHasTranslated(false);
                }}
                isDark={isDark}
              />

              {outputLanguage === 'Natural Language' ? (
                <TextBlock
                  text={outputCode}
                  isDark={isDark}
                  maxCharacterCount={5000}
                  editable={false}
                />
              ) : (
                <CodeBlock
                  code={outputCode}
                  isDark={isDark}
                  editable={false}
                  onChange={() => { }}
                />
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
      <RestrictedModelModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  );
}
