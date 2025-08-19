"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import CreateFolderForm from './CreateFolderForm';
import { FileData } from './CreateCardForm';

interface CreateFolderModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    files: FileData[];
}

const CreateFolderModal = ({ isOpen, onOpenChange, files }: CreateFolderModalProps) => {
    const handleSuccess = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95%] max-w-lg mx-auto bg-white border-4 border-black shadow-neo-lg p-6 flex flex-col max-h-[90vh]">
                <DialogHeader className="flex-shrink-0 pb-2">
                    <DialogTitle className="text-lg sm:text-xl">Create a New Folder</DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                        Organize your files by creating a new folder. Use AI to get smart suggestions.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 min-h-0">
                    <CreateFolderForm 
                        files={files} 
                        onSuccess={handleSuccess}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateFolderModal;