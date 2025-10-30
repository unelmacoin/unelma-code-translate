import { OpenAIModel, xAI, OpenAI } from '@/types/types';
import { FC, useEffect, useState, useMemo } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

interface Props {
  model: OpenAIModel | xAI | OpenAI;
  onChange: (model: OpenAIModel | xAI | OpenAI) => void;
  isDark: boolean;
}

export const ModelSelect: FC<Props> = ({ model, onChange, isDark }) => {
  const [enabledModels, setEnabledModels] = useState<Record<string, boolean>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  const modelOptions = [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4-Turbo' },
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'o1-preview', label: 'GPT-o1-Preview' },
    { value: 'gpt-4.5-preview', label: 'GPT-4.5' },
    { value: 'o1-mini', label: 'GPT-o1-Mini' },
    { value: 'o3-mini', label: 'GPT-o3-mini' },
    { value: 'gpt-5', label: 'GPT-5' },
    { value: 'grok-2-latest', label: 'Grok-2-Latest' },
    { value: 'grok-3-mini-beta', label: 'Grok-3-Mini-Beta' },
    { value: 'grok-3-latest', label: 'Grok-3-Latest' },
    { value: 'deepseek-chat', label: 'DeepSeek' },
  ];

  useEffect(() => {
    const docRef = doc(db, 'config', 'modelAvailability');

    // Initial fetch
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const rawData = docSnap.data() as Record<string, boolean>;
          const normalizedData = Object.fromEntries(
            Object.entries(rawData).map(([key, value]) => [
              key.trim().toLowerCase(),
              value,
            ]),
          );
          setEnabledModels(normalizedData);
        } else {
          console.error('No model availability data found');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching model availability:', error);
        setLoading(false);
      });

    // Real-time listener
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const rawData = docSnap.data() as Record<string, boolean>;
          const normalizedData = Object.fromEntries(
            Object.entries(rawData).map(([key, value]) => [
              key.trim().toLowerCase(),
              value,
            ]),
          );
          setEnabledModels(normalizedData);
        }
      },
      (error) => {
        console.error('Error in model availability listener:', error);
      },
    );

    return () => unsubscribe();
  }, []);

  const isModelEnabled = (modelName: string): boolean => {
    const enabled = enabledModels[modelName.toLowerCase()]; // Ensure case-insensitive matching
    return enabled === true; // Strictly check for boolean true
  };

  useEffect(() => {
    if (!loading && !isModelEnabled(model)) {
      const firstEnabledModel = modelOptions.find((option) =>
        isModelEnabled(option.value),
      );
      if (firstEnabledModel) {
        onChange(firstEnabledModel.value as OpenAIModel | xAI | OpenAI);
        toast(
          `${model} is unavailable. Switched to ${firstEnabledModel.label}.`,
        );
      } else {
       toast.error('No models are currently available. Please try again later.');
      }
    }
  }, [enabledModels, loading, model, onChange]);

  const bg = isDark ? 'bg-[#1A1B26]' : 'bg-[#fff]';
  const textColor = isDark ? 'text-neutral-200 ' : 'text-black';
  
  const availableModels = useMemo(() => {
    return modelOptions.filter((option) => isModelEnabled(option.value));
  }, [enabledModels, modelOptions]);

  if (loading) {
    return (
      <div className={`${bg} ${textColor} h-[40px] w-fit rounded-md px-4 py-2`}>
        Loading models...
      </div>
    );
  }

  return (
    <select
      className={`${bg} ${textColor} h-[40px] w-fit rounded-md px-4 py-2`}
      value={model}
      onChange={(e) => onChange(e.target.value as OpenAIModel | xAI | OpenAI)}
    >
      {availableModels.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
