import React, { MouseEventHandler } from 'react';
import { IoIosMoon, IoIosPartlySunny } from 'react-icons/io';

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
          className={`rounded-full sm:mt-0 mt-2 hover:bg-${isDark ? 'black' : 'gray-600'}`}
        >
          {isDark ? (
            <div className='flex items-center'>
              <IoIosMoon  color='#a1abb5' fontSize={22} />
              <span className=" ml-2 text-[#a1abb5]">Dark</span>
            </div>
          ) : (
            <div className='flex items-center'>
              <IoIosPartlySunny color='#6C7789' fontSize={22} />
              <span className="ml-2">Light</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ThemeButton;
