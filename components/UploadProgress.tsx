'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getFileType, convertFileToUrl } from '@/lib/utils';
import Thumbnail from './Thumbnail';

const UploadProgress = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [position, setPosition] = useState<{ top: number, left: number, width: number } | null>(null);

  useEffect(() => {
    const handleUploadStart = (event: CustomEvent) => {
      setFiles(event.detail.files);
      if (event.detail.rect) {
        setPosition({
          top: event.detail.rect.bottom + window.scrollY + 10,
          left: event.detail.rect.left + window.scrollX,
          width: 384 // 96 * 4
        });
      }
    };

    const handleUploadEnd = (event: CustomEvent) => {
      setFiles(prevFiles => prevFiles.filter(file => file.name !== event.detail.fileName));
    };

    window.addEventListener('upload-start', handleUploadStart as EventListener);
    window.addEventListener('upload-end', handleUploadEnd as EventListener);

    return () => {
      window.removeEventListener('upload-start', handleUploadStart as EventListener);
      window.removeEventListener('upload-end', handleUploadEnd as EventListener);
    };
  }, []);

  const handleRemoveFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed p-4 bg-white border-4 border-black shadow-neo z-50 w-96"
      style={position ? { top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px` } : { display: 'none' }}
    >
      <h4 className="text-lg font-bold text-black mb-4 uppercase tracking-wider">Uploading Files</h4>
      <ul className="space-y-3">
        {files.map((file, index) => {
          const { type, extension } = getFileType(file.name);

          return (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-4 bg-white border-4 border-black shadow-neo"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <Thumbnail
                  type={type}
                  extension={extension}
                  url={convertFileToUrl(file)}
                  className="!size-12 !min-w-12 flex-shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-black truncate text-base">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={60}
                      height={20}
                      alt="Loader"
                      className="block"
                    />
                    <span className="text-sm text-gray-600 font-medium">Uploading...</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRemoveFile(file.name)}
                className="flex-shrink-0 p-2 hover:bg-red-50 border-2 border-red-200 transition-all duration-200 rounded-none"
              >
                <Image
                  src="/assets/icons/remove.svg"
                  width={20}
                  height={20}
                  alt="Remove"
                  className="w-5 h-5"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UploadProgress;
