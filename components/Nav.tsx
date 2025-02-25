import React, { MouseEventHandler } from 'react';
import ThemeButton from './ThemeButton';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Image from 'next/image';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';

interface themeBtn {
  isDark: boolean;
  toggleDarkMode: MouseEventHandler<HTMLButtonElement>;
  handleSignInSuccess?: () => void;
}

export const signInWithGoogle = async (handleSignInSuccess?: () => void) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      toast.success('Successfully signed in using google!\nYou now have unlimited access.', {
        autoClose: 2000 // Show for 2 seconds
      });
      if (handleSignInSuccess) {
        setTimeout(handleSignInSuccess, 1500); // Call handler after 1.5 seconds
      }
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};

const Nav: React.FC<themeBtn> = ({isDark, toggleDarkMode, handleSignInSuccess}) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="mb-0">
      <div className="sm:px-10 flex w-full flex-wrap items-center justify-between py-0 px-4">
        <div className="flex items-center">
          <Link href="https://translate.u16p.com/">
            <h1 className='text-2xl font-medium -mt-1 leading-none'>Unelma-Code Translator</h1>
          </Link>
        </div>
        <div className='flex flex-col items-end space-y-0.5'>
          <div className='flex items-center space-x-4'>
            <Link href="https://u16p.com/" className={isDark ? 'text-[#FFFFFF]' : 'text-[#000000]'}>
              Back to U16P
            </Link>
            <ThemeButton isDark={isDark} toggleDarkMode={toggleDarkMode}/>
          </div>
          <div className={isDark ? 'text-[#FFFFFF] text-xs' : 'text-gray-600 text-xs'}>
            {user ? (
              `Signed in as ${user.displayName || user.email}`
            ) : (
              <button
                onClick={() => signInWithGoogle(handleSignInSuccess)}
                className={`flex items-center justify-center px-4 py-2 transform transition-transform duration-200 ${isDark ? 'text-[#FFFFFF] hover:scale-110' : 'text-[#000000] hover:scale-110'}`}
              >
                <Image
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                  width={24}
                  height={24}
                  className="w-6 h-6 mr-2"
                />
                Sign in with Google
              </button>
            )}
          </div>
          {user && (
            <button
              onClick={handleSignOut}
              className={`text-xs transform transition-transform duration-200 ${isDark ? 'text-[#FFFFFF] hover:scale-110' : 'text-[#000000] hover:scale-110'}`}
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;