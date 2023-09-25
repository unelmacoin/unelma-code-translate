import React from 'react';

interface themeBtn {
  isDark:boolean;
}

const Nav: React.FC<themeBtn> = ({isDark}
) => {
  return (
    <nav>
      <div className=" sm:px-10 flex w-100 relative flex-wrap items-center justify-between py-2 px-4 cursor-pointer">
        <a  href="https://translate.u16p.com/">
        <h1 className='text-2xl font-medium '>Unelma-Code Translator</h1>
        </a>
        <a className={
           isDark
          ? 'text-[#FFFFFF80] '
          : 'text-[#00000080] '} href="https://u16p.com/">
          Back to U16P
        </a>
        </div>
    </nav>
  );
};

export default Nav;
