import { useEffect } from 'react';
import { signInWithGoogle } from './Nav';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface RestrictedModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RestrictedModelModal({ isOpen, onClose }: RestrictedModelModalProps) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  if (!isOpen) return null;

  const handleSignInSuccess = () => {
    toast.success('Successfully signed in using google!\nYou now have unlimited access.', {
      duration: 2000 // Show for 2 seconds
    });
    setTimeout(onClose, 1500); // Close modal after 1.5 seconds
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Advanced Model Limit</h2>
        <p className="mb-6">
          You have used your free translation with this GPT-4 model.
          To continue using advanced models:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Sign in with Google for unlimited access</li>
            <li>Switch to GPT-3.5 for unlimited free translations</li>
          </ul>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => signInWithGoogle(handleSignInSuccess)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transform transition-transform duration-200 hover:scale-110"
          >
            Sign in with Google
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-50 text-black rounded hover:bg-gray-100 transform transition-transform duration-200 hover:scale-110"
          >
            Switch Model
          </button>
        </div>
      </div>
    </div>
  );
}