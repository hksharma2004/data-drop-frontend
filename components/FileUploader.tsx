"use client";

import React, { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";

import { MAX_FILE_SIZE } from "@/constants";
import { usePathname } from "next/navigation";
import Thumbnail from "./Thumbnail";
import { toast } from "sonner";
import { uploadFile } from "@/lib/actions/file.actions";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );

          return toast.error(
            <p className="body-2 text-white">
              <span className="font-semibold">{file.name}</span> is too large.
              Max file size is 50MB.
            </p>,
            {
              className:
                "group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground",
            }
          );
        }

        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadedFile) => {
            if (uploadedFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name)
              );
            }
          }
        );
      });

      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn(
        "uploader-button bg-[#FF7A3D] hover:bg-[#E5672A] transition-all duration-200",
        "flex items-center border-4 border-black shadow-neo hover:shadow-neo-hover active:shadow-neo-active",
        className?.includes('!h-14') ? "gap-0 px-0 py-0" : "gap-3 px-6 py-3",
        "active:scale-95 justify-center font-bold text-base uppercase tracking-wider",
        "hover:transform hover:-translate-x-1 hover:-translate-y-1 active:transform active:translate-x-1 active:translate-y-1 rounded-none",
        className?.includes('!h-14') ? "w-14 h-14" : "w-full",
        className
      )}
      >
        {className?.includes('!h-14') ? (
          <span className="text-black font-bold text-xs">UPLOAD</span>
        ) : (
          <>
            <Image
              src="/assets/icons/upload.svg"
              alt="upload"
              width={20}
              height={20}
              className="w-5 h-5 hover:scale-110 transition-transform flex-shrink-0"
            />
            <span className="text-black font-bold">Upload Files</span>
          </>
        )}
      </Button>
      
      {files.length > 0 && (
        <div className="mt-4 p-4 bg-white border-4 border-black shadow-neo">
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
                    onClick={(e) => handleRemoveFile(e, file.name)}
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
      )}
    </div>
  );
};

export default FileUploader;
