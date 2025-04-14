import React from 'react';
import ThemeButton from './ThemeButton';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface NavProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  showAuthButtons?: boolean;
}

const Nav: React.FC<NavProps> = ({
  isDark,
  toggleDarkMode,
  showAuthButtons = true,
}) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 h-24 ${
        isDark ? 'bg-[#333333] text-white' : 'bg-[#E8EBF5] text-black'
      } transition-all duration-300`}
    >
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-10">
        <div className="flex items-center gap-x-4">
          {/* Logo container with dark mode handling */}
          <div className={`relative h-12 w-12 flex-shrink-0 rounded-lg ${
            isDark ? 'bg-gray-700 p-1.5' : 'bg-gray-100 p-1.5'
          } transition-colors duration-200`}>
            {isDark ? (
              <Image
                src="/unelma-logo.png" // White version for dark mode
                alt="Unelma Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            ) : (
              <Image
                src="/unelma-logo.png" // Dark version for light mode
                alt="Unelma Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            )}
          </div>
          
          {/* Title and subtitle */}
          <Link href="https://translate.u16p.com/" className="flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl font-medium leading-tight">
              Unelma-Code Translator
            </h1>
            <p className={`text-xs mt-0.5 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            } transition-colors duration-200`}>
              AI-powered code translation
            </p>
          </Link>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="https://u16p.com/"
              className={`text-sm sm:text-base hover:underline ${
                isDark ? 'text-[#FFFFFF]' : 'text-[#000000]'
              } transition-colors duration-200`}
            >
              Back to U16P
            </Link>
            <ThemeButton
              isDark={isDark}
              toggleDarkMode={handleDarkModeToggle}
            />
          </div>
          {showAuthButtons && (
            <div className="mt-2 sm:mt-0">
              {user ? (
                <div className="flex items-center">
                  <span className={`text-sm sm:text-base ${
                    isDark ? 'text-white' : 'text-black'
                  } transition-colors duration-200`}>
                    Signed in as <br className="sm:hidden" /> {user.displayName || user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className={`ml-2 sm:ml-4 px-2 sm:px-4 py-1 sm:py-2 rounded-md ${
                      isDark
                        ? 'bg-gray-600 hover:bg-gray-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-black'
                    } transition-all duration-200`}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <Link
                    href="/signup"
                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md ${
                      isDark
                        ? 'bg-gray-600 hover:bg-gray-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-black'
                    } transition-all duration-200`}
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