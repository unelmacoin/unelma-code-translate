import React from 'react';

const Nav: React.FC = () => {
  return (
    <nav>
      <div className=" flex w-100 h-15 text-lg relative flex-wrap items-center justify-between py-2 px-4">
        <a  href="https://translate.u16p.com/">
        <h1 className='font-bold text-2xl '>Unelma-Code Translator</h1>
        </a>
        <a href="https://u16p.com/">
          Back to U16P
        </a>
        </div>
    </nav>
  );
};

export default Nav;
