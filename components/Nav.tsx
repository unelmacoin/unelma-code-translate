import React from 'react';
import ThemeButton from './ThemeButton';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

interface NavProps {
  isDark: boolean;
  toggleDarkMode: () => void; // Changed this type
  showAuthButtons?: boolean;
  offsetTop?: number;
}

const Nav: React.FC<NavProps> = ({
  isDark,
  toggleDarkMode,
  showAuthButtons = true,
  offsetTop,
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
    toggleDarkMode(); // Just call the function directly
  };

  return (
    <nav
      style={{ top: `${offsetTop ?? 0}px` }}
      className={`fixed left-0 right-0 z-50 h-24 ${
        isDark ? 'bg-[#333333] text-white' : 'bg-[#E8EBF5] text-black'
      } transition-all duration-300`}
    >
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-10">
        <div className="flex h-full items-center">
          <Link href="https://translate.u16p.com/">
            <h1 className="text-xl sm:text-2xl font-medium leading-none text-center sm:text-left">
              Unelma-Code <br className="sm:hidden" /> Translator
            </h1>
          </Link>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="https://u16p.com/"
              className={`text-sm sm:text-base ${isDark ? 'text-[#FFFFFF]' : 'text-[#000000]'}`}
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
              className={`mt-2 sm:mt-0 ${
                isDark ? 'text-xs text-white' : 'text-xs text-gray-600'
              }`}
            >
              {user ? (
                <div className="flex items-center">
                  <span className={`text-sm sm:text-base ${isDark ? 'text-white' : 'text-black'}`}>
                    Signed in as <br className="sm:hidden" /> {user.displayName || user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className={`ml-2 sm:ml-4 transform px-2 sm:px-4 py-1 sm:py-2 transition-transform duration-200 ${
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
                  <span className={`text-sm sm:text-base ${isDark ? 'text-white' : 'text-black'}`}></span>
                  <Link
                    href="/signup"
                    className={`flex transform items-center justify-center px-2 sm:px-4 py-1 sm:py-2 transition-transform duration-200 ${
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
