import React, { MouseEventHandler } from 'react';

interface themeBtn {
    isDark:boolean;
    toggleDarkMode: MouseEventHandler<HTMLButtonElement>;

}

const ThemeButton: React.FC<themeBtn>  = ({isDark,toggleDarkMode}) => {

  return (
    <div className={`bg-${isDark ? 'black' : 'white'} text-${isDark ? 'white' : 'black'} transition-all duration-300`}>
      <div className="flex items-center justify-center">
        <button
          onClick={toggleDarkMode}
          className={`rounded-full p-2 ${isDark ? 'bg-yellow-300' : 'bg-gray-700'} hover:bg-${isDark ? 'yellow-400' : 'gray-600'}`}
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9a7 7 0 00-14 0v6a7 7 0 0014 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18a9 9 0 100-18 9 9 0 000 18z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 9H19" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ThemeButton;
