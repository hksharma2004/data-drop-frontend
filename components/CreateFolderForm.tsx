"use client";

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Sparkles, LoaderCircle } from 'lucide-react';
import { FileData } from './CreateCardForm';
import { createFolder, moveFilesToFolder } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';
import { DialogFooter } from "@/components/ui/dialog";

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formSchema = z.object({
  folderName: z.string().min(1, { message: "Folder name cannot be empty." }).max(50, { message: "Folder name is too long." }),
});

type FormData = z.infer<typeof formSchema>;
type AISuggestions = Record<string, string[]>;

interface CreateFolderFormProps {
    files: FileData[];
    onSuccess: () => void;
}

const CreateFolderForm = ({ files, onSuccess }: CreateFolderFormProps) => {
    const path = usePathname();
    const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState<AISuggestions | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const handleSelectFile = useCallback((fileToToggle: FileData) => {
        setSelectedFiles(currentSelected => {
            const isAlreadySelected = currentSelected.some(f => f.$id === fileToToggle.$id);
            if (isAlreadySelected) {
                return currentSelected.filter(f => f.$id !== fileToToggle.$id);
            } else {
                return [...currentSelected, fileToToggle];
            }
        });
    }, []);

    const handleGenerateSuggestions = async () => {
        if (files.length === 0) {
            toast.error("There are no files to analyze.");
            return;
        }
        setIsGenerating(true);
        setSuggestions(null);
        try {
            const response = await fetch('/api/generate-folder-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate suggestions.');
            }
            setSuggestions(result);
            toast.success("AI suggestions generated!");
        } catch (error: any) {
            toast.error(error.message || "An error occurred while generating suggestions.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSuggestionClick = (folderName: string, suggestedFiles: string[]) => {
        setValue('folderName', folderName, { shouldValidate: true });
        const filesToSelect = files.filter(f => suggestedFiles.includes(f.name));
        setSelectedFiles(filesToSelect);
    };

    const onSubmit = async (data: FormData) => {
        if (selectedFiles.length === 0) {
            toast.error("Please select at least one file to include in the folder.");
            return;
        }
        setIsLoading(true);
        try {
            const newFolder = await createFolder({
                folderName: data.folderName,
                path,
            });

            if (!newFolder) {
                throw new Error("Failed to create the folder.");
            }

            await moveFilesToFolder({
                fileIds: selectedFiles.map(f => f.$id),
                folderId: newFolder.$id,
                path,
            });

            toast.success(`Folder "${data.folderName}" created successfully!`);
            onSuccess();
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="flex-1 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="folderName">Folder Name</Label>
                    <Input id="folderName" {...register('folderName')} placeholder="e.g., 'Work Documents'" className="h-12 sm:h-10" />
                    {errors.folderName && <p className="text-xs text-red-500 mt-1">{errors.folderName.message}</p>}
                </div>

                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <Label>Select Files</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateSuggestions}
                            disabled={isGenerating}
                            className="gap-2 text-xs flex-shrink-0 w-full sm:w-auto h-10 sm:h-8 touch-manipulation"
                        >
                            {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            AI Suggestions
                        </Button>
                    </div>

                    {suggestions && (
                        <div className="p-3 border rounded-md bg-muted/50">
                            <p className="text-sm font-medium mb-2">Suggestions:</p>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(suggestions).map(([folderName, fileNames]) => (
                                    <button
                                        type="button"
                                        key={folderName}
                                        onClick={() => handleSuggestionClick(folderName, fileNames)}
                                        className="px-3 py-2 text-xs border rounded-full hover:bg-primary hover:text-primary-foreground touch-manipulation"
                                    >
                                        {folderName} ({fileNames.length})
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-2 border rounded-md h-48 sm:h-56 overflow-y-auto bg-muted/50 space-y-1">
                        {files.map(file => {
                            const isSelected = selectedFiles.some(sf => sf.$id === file.$id);
                            return (
                                <div key={file.$id} className="flex w-full items-center space-x-3 p-2 rounded-md hover:bg-muted touch-manipulation">
                                    <Checkbox id={`file-${file.$id}`} checked={isSelected} onCheckedChange={() => handleSelectFile(file)} className="flex-shrink-0" />
                                    <label htmlFor={`file-${file.$id}`} className="flex-1 cursor-pointer space-y-1 overflow-hidden min-w-0">
                                        <p className="truncate text-sm font-medium leading-tight">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground text-center sm:text-left">
                        <span>{selectedFiles.length} file(s) selected</span>
                    </div>
                </div>
            </div>
            <DialogFooter className="flex-shrink-0 mt-4">
                <Button type="submit" disabled={isLoading} className="w-full h-12 sm:h-10 touch-manipulation">
                    {isLoading ? 'Creating Folder...' : 'Create Folder and Move Files'}
                </Button>
            </DialogFooter>
        </form>
    );
};

export default CreateFolderForm;