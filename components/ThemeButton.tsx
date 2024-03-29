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
          className={'rounded-full sm:mt-0 mt-4 '}
        >
          {isDark ? (
            <div className='flex items-center'>
              <IoIosMoon  color='#fff' fontSize={20} />
              <span className=" text-base ml-2 text-[#fff]">Dark</span>
            </div>
          ) : (
            <div className='flex items-center'>
              <IoIosPartlySunny color='#000' fontSize={22} />
              <span className="ml-2 text-base ">Light</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ThemeButton;
