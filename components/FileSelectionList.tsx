"use client";

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FileData } from './CreateCardForm';

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

interface FileSelectionListProps {
    files: FileData[];
    selectedFiles: FileData[];
    onSelectFile: (file: FileData) => void;
}

const FileSelectionList = ({ files, selectedFiles, onSelectFile }: FileSelectionListProps) => {
    return (
        <div className="border-2 border-black bg-gray-50/50 max-h-72 overflow-y-auto rounded-lg">
            <div className="divide-y divide-gray-200">
                {files.map((file) => {
                    const isSelected = selectedFiles.some(sf => sf.$id === file.$id);
                    return (
                        <div 
                            key={file.$id} 
                            className="flex items-center space-x-3 p-3 sm:p-4 hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer group rounded-lg mx-1 my-1 touch-manipulation"
                            onClick={() => onSelectFile(file)}
                        >
                            <Checkbox 
                                id={`file-${file.$id}`} 
                                checked={isSelected} 
                                onCheckedChange={() => onSelectFile(file)}
                                className="group-hover:border-white group-hover:data-[state=checked]:bg-white group-hover:data-[state=checked]:text-primary flex-shrink-0"
                            />
                            <label 
                                htmlFor={`file-${file.$id}`} 
                                className="flex-1 cursor-pointer space-y-1 overflow-hidden min-w-0"
                            >
                                <p className="text-sm sm:text-base font-medium leading-tight truncate group-hover:text-white">
                                    {file.name}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-white/80">
                                    {formatBytes(file.size)}
                                </p>
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FileSelectionList;