import { useState, useCallback } from 'react';
import { isRestrictedModel } from '../utils/modelUtils';
import { useAuth } from '../contexts/AuthContext';

export const useTranslationLimit = (model: string) => {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { user } = useAuth();

  const checkAndIncrementLimit = useCallback(() => {
    if (!isRestrictedModel(model)) return true;
    if (user) return true; // Authenticated users have no limits

    const key = `translation_${model}`;
    const count = parseInt(localStorage.getItem(key) || '0');
    
    if (count >= 5) {
      setShowLimitModal(true);
      return false;
    }

    localStorage.setItem(key, (count + 1).toString());
    return true;
  }, [model, user]);

  return {
    showLimitModal,
    setShowLimitModal,
    checkAndIncrementLimit
  };
};
