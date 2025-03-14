import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

interface RestrictedModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RestrictedModelModal({ isOpen, onClose }: RestrictedModelModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  if (!isOpen) return null;

  const handleSignUpClick = () => {
    router.push('/signup');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full text-center mx-4 sm:mx-0">
        <h2 className="text-2xl font-bold mb-4">Advanced Model Limit Reached</h2>
        <p className="mb-6">
          You have reached the limit for free translations using GPT-4.  
          To continue using advanced AI models:
        </p>
        <div className="ml-6 mt-2 text-center font-bold">
          <p>Sign Up For Full Access</p>
          <p className="my-1">Or</p>
          <p>Use GPT-3.5 For Free Translations</p>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <div className="flex w-full gap-4">
            <button
              onClick={handleSignUpClick}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transform transition-transform duration-200 hover:scale-110"
            >
              Sign Up
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-50 text-black rounded hover:bg-gray-100 transform transition-transform duration-200 hover:scale-110"
            >
              Switch Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}