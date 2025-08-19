"use client";

import React, { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MAX_FILE_SIZE } from "@/constants";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { uploadFile } from "@/lib/actions/file.actions";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const uploaderRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const rect = uploaderRef.current?.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent("upload-start", { detail: { files: acceptedFiles, rect } })
      );

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          window.dispatchEvent(
            new CustomEvent("upload-end", { detail: { fileName: file.name } })
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
              window.dispatchEvent(
                new CustomEvent("upload-end", {
                  detail: { fileName: file.name },
                })
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

  return (
    <div {...getRootProps()} className="cursor-pointer" ref={uploaderRef}>
      <input {...getInputProps()} />
      <Button
        type="button"
        className={cn(
          "uploader-button bg-[#FF7A3D] hover:bg-[#E5672A] transition-all duration-200",
          "flex items-center border-4 border-black shadow-neo hover:shadow-neo-hover active:shadow-neo-active",
          className?.includes("!h-14") ? "gap-0 px-0 py-0" : "gap-3 px-6 py-3",
          "active:scale-95 justify-center font-bold text-base uppercase tracking-wider",
          "hover:transform hover:-translate-x-1 hover:-translate-y-1 active:transform active:translate-x-1 active:translate-y-1 rounded-none",
          className?.includes("!h-14") ? "w-14 h-14" : "w-full",
          className
        )}
      >
        {className?.includes("!h-14") ? (
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
    </div>
  );
};

export default FileUploader;