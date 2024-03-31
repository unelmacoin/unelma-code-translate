import React, { MouseEventHandler } from 'react';
import { IoIosMoon } from 'react-icons/io';
import { MdLightMode } from "react-icons/md";

interface themeBtn {
  isDark: boolean;
  toggleDarkMode: MouseEventHandler<HTMLButtonElement>;
}

const ThemeButton: React.FC<themeBtn> = ({ isDark, toggleDarkMode }) => {
  return (
    <div className={'transition-all duration-300'}>
      <div className="items-center sm:justify-center">
        <button
          onClick={toggleDarkMode}
          className={'rounded-full sm:mt-0 mt-4 '}
        >
          {isDark ? (
            <div className='flex items-center'>
              <MdLightMode  color='#fff' fontSize={32} title='Switch to Light Mode'/>
            </div>
          ) : (
            <div className='flex items-center'>
              <IoIosMoon color='#000' fontSize={32} title='Switch to Dark Mode'/>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ThemeButton;
