"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { NeoButton } from "@/components/ui/neo-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface PdfFile {
    id: string;
    name: string;
}

interface ChatWithPdfModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

// formatting "*text*" to bold text and handling line breaks
const formatAnswerText = (text: string): string => {
    // Escape existing HTML to prevent XSS
    const escapedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    
    // convert *text* to <strong>text</strong>
    const formattedText = escapedText.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    
    // convert line breaks to <br> tags
    return formattedText.replace(/\n/g, '<br>');
};

const ChatWithPdfModal = ({ isOpen, onOpenChange }: ChatWithPdfModalProps) => {
    const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFetchingPdfs, setIsFetchingPdfs] = useState(false);

    useEffect(() => {
        if (isOpen) {

            setAnswer("");
            setError(null);
            setQuestion("");
            setSelectedFiles([]);
            
            const fetchPdfs = async () => {
                setIsFetchingPdfs(true);
                try {

                    const response = await fetch("/api/chat-pdf/list");
                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.error || "Failed to fetch PDF list from server.");
                    }
                    const data = await response.json();
                    setPdfFiles(data.files || []);
                } catch (err: any) {
                    setError(`Failed to load PDFs: ${err.message}. Is the backend server running?`);
                    setPdfFiles([]);
                } finally {
                    setIsFetchingPdfs(false);
                }
            };
            fetchPdfs();
        }
    }, [isOpen]);

    const handleCheckboxChange = (fileId: string): void => {
        setSelectedFiles(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };

    const handleSubmit = async () => {
        if (selectedFiles.length === 0) {
            setError("Please select at least one PDF file.");
            return;
        }
        if (!question.trim()) {
            setError("Please enter a question.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnswer("");

        try {
            const response = await fetch("/api/chat-pdf/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    file_ids: selectedFiles,
                    question: question,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "An unknown error occurred during processing.");
            }

            const result = await response.json();
            setAnswer(result.answer);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] bg-white border-4 border-black shadow-neo-lg p-6 flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-2xl font-bold">Chat with PDF</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Select PDFs from your storage, ask a question, and get an AI-powered answer.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex gap-6 my-4 min-h-0">
                    {/* Left Column - PDF Selection and Question */}
                    <div className="w-1/2 space-y-4">
                        <div>
                            <h3 className="font-bold mb-2 text-lg">1. Select PDFs</h3>
                            <div className="p-3 border-2 border-black bg-gray-50 max-h-48 overflow-y-auto">
                                {isFetchingPdfs ? (
                                    <p>Loading PDFs...</p>
                                ) : pdfFiles.length > 0 ? (
                                    pdfFiles.map(file => (
                                        <div key={file.id} className="flex items-center space-x-3 my-2">
                                            <Checkbox
                                                id={file.id}
                                                checked={selectedFiles.includes(file.id)}
                                                onCheckedChange={() => handleCheckboxChange(file.id)}
                                                className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                                            />
                                            <label htmlFor={file.id} className="font-medium cursor-pointer">
                                                {file.name}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No PDFs found in your datadrop storage.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-2 text-lg">2. Ask a Question</h3>
                            <Textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="e.g., 'What is the main topic of the selected document(s)?'"
                                className="border-2 border-black focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                rows={4}
                            />
                        </div>

                        {error && <p className="text-red-600 font-bold bg-red-100 p-2 border-2 border-red-600">{error}</p>}
                        
                        {isLoading && (
                            <div className="flex items-center justify-center p-4 border-2 border-black bg-yellow-100">
                                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                <p className="ml-3 font-bold">Getting your answer...</p>
                            </div>
                        )}
                    </div>


                    <div className="w-1/2">
                        <h3 className="font-bold mb-2 text-lg">Answer</h3>
                        {answer ? (
                            <div className="h-full border-2 border-black bg-green-50 shadow-neo overflow-y-auto p-4">
                                <div 
                                    className="text-gray-800"
                                    dangerouslySetInnerHTML={{ __html: formatAnswerText(answer) }}
                                />
                            </div>
                        ) : (
                            <div className="h-full border-2 border-black bg-gray-50 flex items-center justify-center p-4">
                                <p className="text-gray-500 text-center">
                                    Your answer will appear here after you ask a question.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-4 flex-shrink-0">
                    <NeoButton
                        variant="default"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isLoading || isFetchingPdfs}
                        className="w-full"
                    >
                        {isLoading ? "Thinking..." : "Get Answer"}
                    </NeoButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChatWithPdfModal;