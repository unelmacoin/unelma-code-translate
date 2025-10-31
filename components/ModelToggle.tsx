import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { toast } from 'react-hot-toast';

// Define model options to match labels in ModelSelect.tsx
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
  { value: 'grok-2-latest', label: 'Grok-2-Latest' },
  { value: 'grok-3-mini-beta', label: 'Grok-3-Mini-Beta' },
  { value: 'grok-3-latest', label: 'Grok-3-Latest' },
  { value: 'deepseek-chat', label: 'DeepSeek' },
];

const ModelToggle: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [models, setModels] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [togglingModel, setTogglingModel] = useState<string | null>(null); // For toggle actions

  useEffect(() => {
    const fetchModelAvailability = async () => {
      try {
        const docRef = doc(db, 'config', 'modelAvailability');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setModels(docSnap.data());
        } else {
          toast.error('Model configuration not found');
        }
      } catch (error) {
        toast.error('Error fetching model availability');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchModelAvailability();
  }, []);

  const toggleModel = async (modelName: string) => {
    try {
      setTogglingModel(modelName); // Set the model being toggled

      // Get current user's token
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        toast.error('Authentication required');
        return;
      }

      // Make sure we're sending simple boolean values
      const newEnabledState = !models[modelName];

      const response = await fetch('/api/updateModelAvailability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          modelName,
          enabled: newEnabledState,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update model status');
      }

      // Update local state on success - ensure we're setting a boolean
      setModels((prev) => ({
        ...prev,
        [modelName]: Boolean(newEnabledState),
      }));

      toast.success(`${modelName} ${newEnabledState ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating model availability:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update model status',
      );
    } finally {
      setTogglingModel(null); // Reset the toggling state
    }
  };

  const getModelLabel = (modelName: string): string => {
    const model = modelOptions.find((option) => option.value === modelName);
    return model ? model.label : modelName; // Fallback to modelName if no label is found
  };

  if (loading) {
    return <div className="text-center">Loading model configurations...</div>;
  }

  return (
    <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="mb-4 flex items-center justify-center">
        <h2
          className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-black'
          }`}
        >
          Model Availability
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(models).map(([modelName, isEnabled]) => (
          <div
            key={modelName}
            className={`flex items-center justify-between rounded-lg p-4 ${
              isDark ? 'bg-gray-700' : 'bg-white'
            }`}
          >
            <span
              className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}
            >
              {getModelLabel(modelName)} {/* Use label from modelOptions */}
            </span>
            <button
              onClick={() => toggleModel(modelName)}
              disabled={togglingModel === modelName} // Disable only the button being toggled
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled ? 'bg-green-500' : 'bg-gray-400'
              } ${
                togglingModel === modelName
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelToggle;
