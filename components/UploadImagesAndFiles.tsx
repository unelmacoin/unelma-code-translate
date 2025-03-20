import React, { useState } from 'react';
import { IoIosImage } from 'react-icons/io';
import { FaFile } from 'react-icons/fa';

interface UploadImagesAndFilesProps {
  onUpload: (file: File | File[]) => void;
}

const UploadImagesAndFiles: React.FC<UploadImagesAndFilesProps> = ({
  onUpload,
}) => {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
      setUploadSuccess(true);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const validTypes = [
          'text/plain',
          'application/pdf',
          'application/msword',
        ];
        return validTypes.includes(file.type);
      });

      if (validFiles.length > 0) {
        onUpload(validFiles);
        setUploadSuccess(true);
      }
    }
  };

  return (
    <div className="flex flex-row space-x-4">
      <button
        className="text-md flex cursor-pointer items-center"
        onClick={() => document.getElementById('image-upload')?.click()}
        title="Upload an image to translate your code"
      >
        <IoIosImage size={32} />
        Image
      </button>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        data-testid="image-input"
      />

      <button
        className="text-md flex cursor-pointer items-center"
        onClick={() => document.getElementById('file-upload')?.click()}
        title="Upload a file to translate your code"
      >
        <FaFile size={32} />
        File
      </button>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        data-testid="file-input"
      />
      {uploadSuccess && <p>Upload successful</p>}
    </div>
  );
};

export default UploadImagesAndFiles;
