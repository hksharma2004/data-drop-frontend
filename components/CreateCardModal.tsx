"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import CreateCardForm, { FileData } from './CreateCardForm';

interface CreateCardModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    files: FileData[];
    preSelectedFile?: FileData;
}

const CreateCardModal = ({ isOpen, onOpenChange, files, preSelectedFile }: CreateCardModalProps) => {
    
    console.log("--- CreateCardModal RENDERED ---");
    console.log("isOpen prop:", isOpen);
    console.log("preSelectedFile prop:", preSelectedFile?.name);

    const handleSuccess = (cardId: string) => {
        setTimeout(() => {
            onOpenChange(false);
        }, 5000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95%] max-w-lg mx-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Create a New Share Card</DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                        Select files from your library and add details to create a shareable card.
                    </DialogDescription>
                </DialogHeader>
                
                <CreateCardForm 
                    files={files} 
                    onSuccess={handleSuccess} 
                    key={preSelectedFile?.$id || 'new-card'}
                    preSelectedFile={preSelectedFile}
                />

            </DialogContent>
        </Dialog>
    );
};

export default CreateCardModal;
