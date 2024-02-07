import React, { useState } from 'react';
import { IoIosImage } from 'react-icons/io';
import { FaFile } from 'react-icons/fa';

interface UploadImagesAndFilesProps {
  onUpload: (file: File) => void;
}

const UploadImagesAndFiles: React.FC<UploadImagesAndFilesProps> = ({ onUpload }) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className='flex flex-row justify-center space-x-4'>
      <button className='flex items-center text-md cursor-pointer' onClick={() => document.getElementById('image-upload')?.click()}>
        <IoIosImage size={32} />
        Image
      </button>
      <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
      
      <button className='flex items-center text-md cursor-pointer' onClick={() => document.getElementById('file-upload')?.click()}>
        <FaFile size={32} />
        File
      </button>
      <input id="file-upload" type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
    </div>
  );
};

export default UploadImagesAndFiles;
