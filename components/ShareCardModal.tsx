"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface ShareCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    cardId: string | null;
}

const ShareCardModal = ({ isOpen, onClose, cardId }: ShareCardModalProps) => {
    if (!cardId) return null;

    const shareUrl = `${window.location.origin}/share/${cardId}`;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                className="sm:max-w-md bg-white border-4 border-black p-6"
                style={{ boxShadow: '10px 10px 0px #000000' }}
            >
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-bold">Share this Card</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Anyone with this QR code or link can view the files.
                    </p>
                    <div className="p-4 border-2 border-black bg-gray-50 shadow-neo">
                        <QRCodeSVG value={shareUrl} size={180} />
                    </div>
                    <div className="w-full flex items-center space-x-2">
                        <Input value={shareUrl} readOnly className="flex-grow border-2 border-black" />
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                toast.info("Link copied to clipboard!");
                            }}
                            variant="outline"
                            className="border-2 border-black"
                        >
                            Copy
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareCardModal;
