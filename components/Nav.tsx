import React, { useState, useEffect, MouseEventHandler } from 'react';
import ThemeButton from './ThemeButton';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';

interface NavProps {
  isDark: boolean;
  toggleDarkMode: () => void; // Changed this type
  showAuthButtons?: boolean;
}

export const signInWithGoogle = async (handleSignInSuccess?: () => void) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (result.user && handleSignInSuccess) {
      setTimeout(handleSignInSuccess, 1500); // Call handler after 1.5 seconds
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};

const Nav: React.FC<NavProps> = ({
  isDark,
  toggleDarkMode,
  showAuthButtons = true,
}) => {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode(); // Just call the function directly
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 h-24 ${
        isDark ? 'bg-[#333333] text-white' : 'bg-[#E8EBF5] text-black'
      } transition-all duration-300`}
    >
      <div className="flex h-full w-full flex-wrap items-center justify-between px-4 sm:px-10">
        <div className="flex h-full items-center">
          <Link href="https://translate.u16p.com/">
            <h1 className="text-2xl font-medium leading-none">
              Unelma-Code Translator
            </h1>
          </Link>
        </div>
        <div className="flex h-full flex-col items-end">
          <div className="mt-6 flex h-full items-center space-x-4">
            <Link
              href="https://u16p.com/"
              className={isDark ? 'text-[#FFFFFF]' : 'text-[#000000]'}
            >
              Back to U16P
            </Link>
            <ThemeButton
              isDark={isDark}
              toggleDarkMode={handleDarkModeToggle}
            />
          </div>
          {showAuthButtons && (
            <div
              className={`${
                isDark ? 'text-xs text-white' : 'text-xs text-gray-600'
              } mb-4`}
            >
              {user ? (
                <div className="flex items-center">
                  <span className={isDark ? 'text-white' : 'text-black'}>
                    Signed in as {user.displayName || user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className={`ml-4 transform px-4 py-2 transition-transform duration-200 ${
                      isDark
                        ? 'text-white hover:scale-110'
                        : 'text-black hover:scale-110'
                    }`}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className={isDark ? 'text-white' : 'text-black'}></span>
                  <Link
                    href="/signup"
                    className={`flex transform items-center justify-center px-4 py-2 transition-transform duration-200 ${
                      isDark
                        ? 'text-white hover:scale-110'
                        : 'text-black hover:scale-110'
                    }`}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
