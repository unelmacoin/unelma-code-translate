import React from 'react';

const Nav: React.FC = () => {
  return (
    <nav>
      <div className=" flex w-100 h-10 relative flex-wrap items-center justify-between py-2 cursor-pointer">
        <a  href="https://translate.u16p.com/">
        <h1 className='text-2xl font-medium pl-10 '>Unelma-Code Translator</h1>
        </a>
        <a className='bg-transparent pr-10' href="https://u16p.com/">
          Back to U16P
        </a>
        </div>
    </nav>
  );
};

export default Nav;
