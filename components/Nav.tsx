import React, { MouseEventHandler } from 'react';
import ThemeButton from './ThemeButton';

interface themeBtn {
  isDark: boolean;
  toggleDarkMode: MouseEventHandler<HTMLButtonElement>;
}

const Nav: React.FC<themeBtn> = ({ isDark, toggleDarkMode }) => {
  return (
    <nav>
      <div className="flex w-full cursor-pointer flex-wrap  items-center justify-between px-4 py-2 sm:px-10">
        <a href="https://translate.u16p.com/">
          <h1 className="text-2xl font-medium ">Unelma-Code Translator</h1>
        </a>
        <div className="flex items-center justify-center space-x-4">
          <a
            className={isDark ? 'text-[#FFFFFF] ' : 'text-[#000000] '}
            href="https://u16p.com/"
          >
            Back to U16P
          </a>
          <ThemeButton isDark={isDark} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
