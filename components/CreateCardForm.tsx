"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { Sparkles, LoaderCircle } from 'lucide-react';
import { DialogFooter } from './ui/dialog';

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};


const formSchema = z.object({
  name: z.string().min(3, { message: "Card name must be at least 3 characters." }),
  description: z.string().max(255, { message: "Description must be 255 characters or less." }),
});

type FormData = z.infer<typeof formSchema>;

export interface FileData {
    $id: string;
    name: string;
    size: number;
}

interface CreateCardFormProps {
    files: FileData[];
    onSuccess: (cardId: string) => void;
    preSelectedFile?: FileData;
}

const CreateCardForm = ({ files, onSuccess, preSelectedFile }: CreateCardFormProps) => {
    const [selectedFiles, setSelectedFiles] = useState<FileData[]>(preSelectedFile ? [preSelectedFile] : []);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedTags, setGeneratedTags] = useState<string[]>([]);
    const [view, setView] = useState<'form' | 'success'>('form');
    const [newCardId, setNewCardId] = useState('');

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "", 
        }
    });

    const totalSelectedSize = useMemo(() => {
        return selectedFiles.reduce((acc, file) => acc + file.size, 0);
    }, [selectedFiles]);

    const handleGenerateMetadata = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select at least one file to generate metadata.");
            return;
        }
        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-card-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    files: selectedFiles.map(({ name, size }) => ({ name, size })),
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate suggestions.');
            }
            
            setValue('name', result.name, { shouldValidate: true });
            
            const rawDescription = result.description || "";
            const sanitizedDescription = rawDescription.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '');
            setValue('description', sanitizedDescription, { shouldValidate: true });

            setGeneratedTags(result.tags || []);
            toast.success("Name, description, and tags have been generated!");
        } catch (error: unknown) {
            let errorMessage = "An unexpected error occurred during generation.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectFile = useCallback((fileToToggle: FileData) => {
        setSelectedFiles(currentSelected => {
            const isAlreadySelected = currentSelected.some(f => f.$id === fileToToggle.$id);
            if (isAlreadySelected) {
                return currentSelected.filter(f => f.$id !== fileToToggle.$id);
            } else {
                if (currentSelected.length >= 10) {
                    toast.warning("You can only select up to 10 files.");
                    return currentSelected;
                }
                const currentSize = currentSelected.reduce((acc, f) => acc + f.size, 0);
                if (currentSize + fileToToggle.size > 100 * 1024 * 1024) {
                    toast.warning("Adding this file would exceed the 100MB limit.");
                    return currentSelected;
                }
                return [...currentSelected, fileToToggle];
            }
        });
    }, []);

    const onSubmit = async (data: FormData) => {
        if (selectedFiles.length === 0) {
            toast.error("You must select at least one file.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch('/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    fileIds: selectedFiles.map(f => f.$id),
                    tags: generatedTags,
                }),
            });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.error || 'Failed to create card.'); }
            toast.success("Card created successfully!");
            setNewCardId(result.card.cardId);
            setView('success');
            onSuccess(result.card.cardId);
        } catch (error: unknown) {
            let errorMessage = "An unexpected error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (view === 'success') {
        const shareUrl = `${window.location.origin}/share/${newCardId}`;
        return (
            <div className="flex flex-col items-center gap-4 text-center p-4">
                <h3 className="text-lg font-semibold">Share Your Card!</h3>
                <p className="text-sm text-muted-foreground">Anyone with this QR code or link can view the files.</p>
                <div className="p-2 border rounded-lg bg-white"><QRCodeSVG value={shareUrl} size={160} /></div>
                <Input value={shareUrl} readOnly />
                <Button onClick={() => { navigator.clipboard.writeText(shareUrl); toast.info("Link copied!"); }}>Copy Link</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <Label htmlFor="name">Card Name</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateMetadata}
                            disabled={isGenerating || selectedFiles.length === 0}
                            className="gap-2 text-xs flex-shrink-0 w-full sm:w-auto h-10 sm:h-8 touch-manipulation"
                        >
                            {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            Smart Autofill
                        </Button>
                    </div>
                    <Input id="name" {...register('name')} placeholder="e.g., Project Alpha Design Files" className="h-12 sm:h-10" />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea id="description" {...register('description')} placeholder="A brief summary of the files" className="min-h-[80px] sm:min-h-[100px]" />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                </div>
                {generatedTags.length > 0 && (
                    <div className="grid gap-2">
                        <Label>Generated Tags</Label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30">
                            {generatedTags.map((tag, index) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 text-sm font-medium rounded-full border"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            These tags were automatically generated based on your selected files.
                        </p>
                    </div>
                )}
                <div className="grid gap-3">
                    <Label>Select Files</Label>
                    <div className="p-2 border rounded-md h-48 sm:h-56 overflow-y-auto bg-muted/50 space-y-1">
                        {files.map(file => {
                            const isSelected = selectedFiles.some(sf => sf.$id === file.$id);
                            return (
                                <div key={file.$id} className="flex w-full items-center space-x-3 p-2 rounded-md hover:bg-muted touch-manipulation">
                                    <Checkbox id={`card-file-${file.$id}`} checked={isSelected} onCheckedChange={() => handleSelectFile(file)} className="flex-shrink-0" />
                                    <label htmlFor={`card-file-${file.$id}`} className="flex-1 cursor-pointer space-y-1 overflow-hidden min-w-0">
                                        <p className="truncate text-sm font-medium leading-tight">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground text-center sm:text-left">
                        <span>{selectedFiles.length}/10 files selected</span>
                        <span className="mx-2">|</span>
                        <span>{formatBytes(totalSelectedSize)} / 100 MB</span>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isLoading} className="w-full h-12 sm:h-10 touch-manipulation">
                    {isLoading ? 'Creating...' : 'Create Card'}
                </Button>
            </DialogFooter>
        </form>
    );
};

export default CreateCardForm;